//= require ./geo_plotter
//= require ./css3dobject

$(document).ready(function() {

  // Initializing variables
  var renderer, scene, camera, spotLight,
    plane, controls, group, loader;

  var mouse = new THREE.Vector2(),
    raycaster = new THREE.Raycaster(),
    radius = 100,
    theta = 0,
    INTERSECTED;

  // Canvas will be attached to this DIV element created
  var container = document.createElement('div');
  document.body.appendChild(container);

  /*
    In initMap() function below steps happen
    1. Initializes camera, renderer, scene, light, group( which will group all geometries together and add to the scene at once).
    2. Converts SVG path to Shape geometries
    3. Adds all City Geometries to the group
  */
  initMap();

  // This handles the way we rotate our scene. Basically it rotates camera instead of 3D object
  trackMovement();

  // function which runs infinitely to render 3D movements
  animate();

  // Event listeners for mouse
  eventListeners();

  // Add pointsData
  addDensityData("santa_clara", "hot_area");

  function addDensityData(geo, dataType) {
    url = "area_statistics?area=" + geo + "&type=" + dataType;

    requestDataFromServer(url).done(function(data) {
      plotGeoDataPoints(data);
    });
  }

  function plotGeoDataPoints(data) {
    // var obj = new GeoPlotter(data).plot();
    window.geoData = data;
    var geom = new THREE.Geometry();
    var dataToPlot = [];
    // var latLongCollection = [];

    var cubeMat = new THREE.MeshLambertMaterial({
      color: 0x000000,
      opacity: 0.6,
      emissive: 0xffffff
    });

    // Loop through the Zip codes and grab one lat/long per zip Code for future plotting.
    for (var i = 0; i < data.areas.length; i++) {
      var plotData = {}

      plotData["zip_code"] = data.areas[i]["zip_code"];
      plotData["lat_lng"] = [data.areas[i]["lat"], data.areas[i]["lng"]];
      plotData["most_viewed"] = data.areas[i]["most_viewed"];
      plotData["leads_submitted"] = data.areas[i]["leads_submitted"];
      plotData["saved"] = data.areas[i]["saved"];
      plotData["shared"] = data.areas[i]["shared"];
      plotData["hotness_score"] = data.areas[i]["most_viewed"] + data.areas[
        i]["leads_submitted"] + data.areas[i]["saved"] + data.areas[i][
        "shared"
      ];
      plotData["properties"] = data.areas[i]["properties"];
      dataToPlot.push(plotData);
    }


    plotIn3dWorld(dataToPlot);
  }

  function plotIn3dWorld(geoPoints) {

    for (var x = 0; x < geoPoints.length; x++) {
      var lat = geoPoints[x]["lat_lng"][0];
      var lng = geoPoints[x]["lat_lng"][1];

      const Y_UNIT = 0.05268209219,
        X_UNIT = 0.05235987756;

      const PIVOT_POINT = [37.36261, -122.08903]; // (y , x)
      const POVOT_POINT_SVG = [43.30236423376482, 69.81056448139134]; //(x, y)

      var newY = POVOT_POINT_SVG[1] - (lat - PIVOT_POINT[0]) * Y_UNIT *
        100000
      var newX = POVOT_POINT_SVG[0] + (lng - PIVOT_POINT[1]) * X_UNIT *
        100000


      svgToPlot = "M," + newX + "," + newY + ", L," + (newX + 30) + "," + (
          newY) + ", L," + (newX + 30) + "," + (newY + 30) + ", L," + (newX +
          30) +
        "," + (newY) + ", L," + (newX + 30) + "," + (newY);

      path = $d3g.transformSVGPath(svgToPlot);
      // color = new THREE.Color( theColors[i] );
      material = new THREE.MeshPhongMaterial({
        color: "green"
      });

      simpleShapes = path.toShapes(true);
      for (j = 0; j < simpleShapes.length; ++j) {
        simpleShape = simpleShapes[j];
        shape3d = simpleShape.extrude({
          amount: 50,
          bevelEnabled: false
        });
      }
      mesh = new THREE.Mesh(shape3d, material);
      group.add(mesh)
      mesh.geoInfo = geoPoints[x];
      mesh.rotation.x = Math.PI;
      mesh.scale.set(0.5635568066383669, 0.5635568066383669, 1);
      // mesh.scale.set(1, 1, 1);
      mesh.translateZ(-80 - 1);
      mesh.translateX(-600);
      mesh.translateY(-150);
    } // end of for Loop


    return true;
  }

  function requestDataFromServer(url) {
    return $.ajax({
      url: url
    });
  }

  function initMap() {
    // Sets the renderer, which basically renders (scene + camera) together
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor('#ececec');
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Creates a canvas, which gets attached to DIV element created above
    container.appendChild(renderer.domElement);

    // Sets the camera.
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight,
      1, 10000);
    camera.position.set(0, -700, 1500);

    // Sets the Scene
    scene = new THREE.Scene();

    // Create a group
    group = new THREE.Group();
    scene.add(group);

    spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 0, 1300);
    scene.add(spotLight);

    // This is for big plane which is at back of all our city geometries.
    var planGeometry = new THREE.PlaneGeometry(3000, 1500,
      90, 90);
    // var planGeometry = new THREE.PlaneGeometry(3000, 1500, 10);
    var planeMaterial = new THREE.MeshBasicMaterial({
      // color: '#C0C0C0',
      wireframe: true,
      // blending: THREE.NoBlending,
      side: THREE.DoubleSide
    });
    plane = new THREE.Mesh(planGeometry, planeMaterial);
    group.add(plane);

    // Get the shapeGeometry from SVG path's
    initSVGObject().done(function(data) {
      addGeoObject(group, data);
    });
  };

  function trackMovement() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    controls.enableZoom = false;
  };

  function initSVGObject() {
    return $.ajax({
      url: 'load_city_data'
    });
  };

  // Add the Shape Geometries with properties to the group
  function addGeoObject(group, svgObject) {
    var i, j, len, len1;
    var mesh, color, material, amount, simpleShapes, simpleShape, shape3d,
      x, toAdd, results = [];
    var thePaths = svgObject.paths;
    var theAmounts = svgObject.amounts;
    var theColors = svgObject.colors;
    var theCenter = svgObject.center;
    var theInfo = svgObject.info;
    len = thePaths.length;

    for (i = 0; i < len; ++i) {
      path = $d3g.transformSVGPath(thePaths[i]);

      color = new THREE.Color(theColors[i]);
      material = new THREE.MeshPhongMaterial({
        color: color
      });

      amount = theAmounts[i];
      simpleShapes = path.toShapes(true);
      len1 = simpleShapes.length;
      for (j = 0; j < len1; ++j) {
        simpleShape = simpleShapes[j];
        shape3d = simpleShape.extrude({
          amount: amount,
          bevelEnabled: false
        });
        mesh = new THREE.Mesh(shape3d, material);
        mesh.info = theInfo[i];
        mesh.rotation.x = Math.PI;
        mesh.scale.set(0.5635568066383669, 0.5635568066383669, 1);
        mesh.translateZ(-amount - 1);
        mesh.translateX(-theCenter.x);
        mesh.translateY(-theCenter.y);
        group.add(mesh);
      }
    }
  };


  function eventListeners() {
    window.addEventListener('resize', onWindowResize, false);

    // check if hovered over cities
    window.addEventListener('mousemove', onDocumentMouseMove, true);
  };


  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycasting();
  };

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
  };

  function render() {
    renderer.render(scene, camera);
  };

  // This is handling the mouse over thingy.
  function raycasting() {

    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      if (INTERSECTED != intersects[0].object) {

        if (INTERSECTED) {
          INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
        }

        INTERSECTED = intersects[0].object;

        // Follwoing MESH is a mess :()
        if (INTERSECTED.geoInfo !== undefined) {
          var currentGeoArea = INTERSECTED.geoInfo;
          bindGeoDetails(currentGeoArea);
        } else {
          if (INTERSECTED.info === undefined) {
            INTERSECTED = null;
            return;
          } else {
            // console.log(INTERSECTED.info);
            INTERSECTED = null;
            // INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
            // INTERSECTED.material.color.setHex(0xff0000);
          }
        }
      }
    } else {
      if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
      INTERSECTED = null;
    }
  };


  function bindGeoDetails(data) {
    console.log(data);
    var element = document.querySelector('#infoPopUp');
    element.style.display = 'block';
    var cssObject = new THREE.CSS3DObject(element);
    cssObject.position = plane.position;
    cssObject.rotation = plane.rotation;
    scene.add(cssObject);
  }

  // function addDensityData(data) {
  //   window.pos = [];
  //   var geom = new THREE.Geometry();
  //
  //   var cubeMat = new THREE.MeshLambertMaterial({
  //     color: 0x000000,
  //     opacity: 0.6,
  //     emissive: 0xffffff
  //   });
  //
  //   for (var i = 0; i < data.length; i++) {
  //
  //     // var x = data[i][0] * (Math.PI / 180);
  //     // var y = data[i][1] * (Math.PI / 180);
  //     var x = data[i][0];
  //     var y = data[i][1];
  //     // var position = latLongToVector3(x, y);
  //     var postion = latLngToPointXY(x, y)
  //
  //   }
  // }
  //
  // function latLngToPointXY(lat, lng) {
  //   // [37.38122, -121.98051]
  //   // per 0.00001 in svg
  //   const Y_UNIT = 0.05268209219,
  //     X_UNIT = 0.05235987756;
  //   const PIVOT_POINT = [37.36261, -122.08903]; // (y , x)
  //   const POVOT_POINT_SVG = [43.30236423376482, 69.81056448139134]; //(x, y)
  //
  //   // var newY = (lat - PIVOT_POINT[0]) * Y_UNIT * 100000
  //   // var newX = (lng - PIVOT_POINT[1]) * X_UNIT * 100000
  //   var newY = POVOT_POINT_SVG[1] - (lat - PIVOT_POINT[0]) * Y_UNIT *
  //     100000
  //   var newX = POVOT_POINT_SVG[0] + (lng - PIVOT_POINT[1]) * X_UNIT *
  //     100000
  //
  //   // console.log(newX)
  //   // console.log(newY)
  //
  //   svgToPlot = "M," + newX + "," + newY + ", L," + (newX + 20) + "," + (
  //       newY) + ", L," + (newX + 20) + "," + (newY + 20) + ", L," + (newX) +
  //     "," + (newY) + ", L," + (newX) + "," + (newY);
  //   path = $d3g.transformSVGPath(svgToPlot);
  //   // color = new THREE.Color( theColors[i] );
  //   material = new THREE.MeshPhongMaterial({
  //     color: "green"
  //   });
  //   simpleShapes = path.toShapes(true);
  //   for (j = 0; j < simpleShapes.length; ++j) {
  //     simpleShape = simpleShapes[j];
  //     shape3d = simpleShape.extrude({
  //       amount: 200,
  //       bevelEnabled: false
  //     });
  //   }
  //   mesh = new THREE.Mesh(shape3d, material);
  //   group.add(mesh)
  //   mesh.rotation.x = Math.PI;
  //   mesh.scale.set(0.5635568066383669, 0.5635568066383669, 1);
  //   mesh.translateZ(-80 - 1);
  //   mesh.translateX(-600);
  //   mesh.translateY(-150);
  //   return true;
  // }

});
