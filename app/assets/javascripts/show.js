//= require ./geo_plotter
//= require ./css3dobject

$(document).ready(function() {

  // Initializing variables
  var renderer, scene, camera, spotLight, directionLightLeft, directionLightRight,
  plane, controls, group, loader, camBackup = {};

  var clickCounter = 0;

  var mouse = new THREE.Vector2(),
  raycaster = new THREE.Raycaster(),
  raycaster2 = new THREE.Raycaster(),
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

  // function which runs infinitely to render 3D movements
  animate();

  // Event listeners for mouse
  eventListeners();

  // Add pointsData
  addDensityData(SEARCHED_GEO.city, SEARCHED_GEO.type);

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

      plotData["city"] = data.city;
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
      plotData["properties"] = data.areas[i]["properties"].slice(1, 4);
      dataToPlot.push(plotData);
    }

    plotIn3dWorld(dataToPlot);
    // plotCone();
  }

  function plotCone() {
    const Y_UNIT = 5.3898302533,
      X_UNIT = 5.3823801302;

    const PIVOT_POINT = [37.34072, -121.93221]; // (y , x)
    const POVOT_POINT_SVG = [484.378916507,1756.57331242]; //(x, y)
    
    var points = [
      [37.3555465, -121.9586176],
      [37.4480379, -121.8487399]
    ];

    for (var i = 0; i < points.length; i++) {
      var lat = points[i][0];
      var lng = points[i][1];

      var newY = POVOT_POINT_SVG[1] - (lat - PIVOT_POINT[0]) * Y_UNIT *
        1000
      var newX = POVOT_POINT_SVG[0] + (lng - PIVOT_POINT[1]) * X_UNIT *
        1000

      var coneGeometry = new THREE.ConeGeometry(28, 120, 60);
      var coneMaterial = new THREE.MeshBasicMaterial({
        color: "green"
      });

      var coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
      coneMesh.rotation.x = -Math.PI / 2;
      coneMesh.position.set(newX, newY, 0);
      coneMesh.translateY(-150);
      console.log(coneMesh);
      group.add(coneMesh);
    }

  }

  function plotIn3dWorld(geoPoints) {

     for (var x = 0; x < geoPoints.length; x++) {
       var lat = geoPoints[x]["lat_lng"][0];
       var lng = geoPoints[x]["lat_lng"][1];

       const Y_UNIT = 5.3898302533,
         X_UNIT = 5.3823801302;

       const PIVOT_POINT = [37.34072, -121.93221]; // (y , x)
       const POVOT_POINT_SVG = [484.378916507,1756.57331242]; //(x, y)

       var newY = POVOT_POINT_SVG[1] - (lat - PIVOT_POINT[0]) * Y_UNIT * 1000
       var newX = POVOT_POINT_SVG[0] + (lng - PIVOT_POINT[1]) * X_UNIT * 1000



       svgToPlot = "M," + newX + "," + newY + ", L," + (newX + 30) + "," + (
         newY) + ", L," + (newX + 30) + "," + (newY + 30) + ", L," + (newX +
         30) + "," + (newY) + ", L," + (newX + 30) + "," + (newY);

       path = $d3g.transformSVGPath(svgToPlot);
       // color = new THREE.Color( theColors[i] );
       material = new THREE.MeshPhongMaterial({
         color: "green"
       });

       simpleShapes = path.toShapes(true);
       for (j = 0; j < simpleShapes.length; ++j) {
         simpleShape = simpleShapes[j];
         shape3d = simpleShape.extrude({
           amount: 100,
           bevelEnabled: false
         });
       }
       mesh = new THREE.Mesh(shape3d, material);
       group.add(mesh)

       mesh.geoInfo = geoPoints[x];
       mesh.rotation.x = Math.PI;
       mesh.scale.set(0.5635568066383669, 0.5635568066383669, 1);
       mesh.translateZ(-100);
       mesh.translateX(-600);
       mesh.translateY(-1000);
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
      renderer.setClearColor('#191919');
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Creates a canvas, which gets attached to DIV element created above
      container.appendChild(renderer.domElement);

      // Sets the camera.
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
      camera.position.set(0, -700, 1500);


      trackMovement();

      camBackup.position      = camera.position.clone();
      camBackup.rotation      = camera.rotation.clone();
      camBackup.controlCenter = controls.center.clone();

      // Sets the Scene
      scene = new THREE.Scene();

      // Create a group
      group = new THREE.Group();
      scene.add(group);

      spotLight = new THREE.SpotLight('white');
      spotLight.position.set(0, 0, 1500);
      scene.add(spotLight);

      directionLightLeft = new THREE.DirectionalLight( 0xffffff, 0.5 );
      directionLightLeft.position.set(-500, 0, 100);
      scene.add(directionLightLeft);

      directionLightRight = new THREE.DirectionalLight( 0xffffff, 0.5 );
      directionLightRight.position.set(500, 0, 100);
      scene.add(directionLightRight);

      // This is for big plane which is at back of all our city geometries.
      var planGeometry = new THREE.PlaneGeometry(3000, 1500, 90, 90);
      // var planGeometry = new THREE.PlaneGeometry(3000, 1500, 10);
      var planeMaterial = new THREE.MeshBasicMaterial({
        color: '#EE82EE',
        wireframe: true,
        // blending: THREE.NoBlending,
        side: THREE.DoubleSide
      });
      plane = new THREE.Mesh(planGeometry, planeMaterial);
      plane.userData.info = {name: 'black-board'};
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

      // var thePaths = svgObject.paths;
      // var theAmounts = 10;
      // var theColors = svgObject.info;
      // var theCenter = svgObject.center;
      // var theInfo = svgObject.info;
      len = svgObject.length;

      for (i = 0; i < len; ++i) {
        path = $d3g.transformSVGPath(svgObject[i].path);

        color = new THREE.Color(svgObject[i].color);
        material = new THREE.MeshPhongMaterial({ color: color });

        amount = 50;
        simpleShapes = path.toShapes(true);
        len1 = simpleShapes.length;
        for (j = 0; j < len1; ++j) {
          simpleShape = simpleShapes[j];
          shape3d = simpleShape.extrude({
            amount: 50,
            bevelEnabled: false
          });
          mesh = new THREE.Mesh(shape3d, material);
          mesh.userData.info = svgObject[i];
          mesh.rotation.x = Math.PI;
          mesh.scale.set(0.5635568066383669, 0.5635568066383669, 1);
          mesh.translateZ(-50);
          mesh.translateX(-600);
          mesh.translateY(-1000);
          group.add(mesh);
        }
      }
    };


    function eventListeners() {
      window.addEventListener('resize', onWindowResize, false);

      // check if hovered over cities
      window.addEventListener('mousemove', onDocumentMouseMove, true);
      window.addEventListener('mousedown', onDocumentMouseClick, true);
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

    function onDocumentMouseClick(event) {
      event.preventDefault();
      zoomToCity();
    }

    function zoomToCity() {
      raycaster2.setFromCamera(mouse, camera);
      var intersects = raycaster2.intersectObjects(scene.children, true);

      if ( clickCounter < 1 && intersects.length > 1) {
        clickCounter += 1;

        var city_object = getCenterPoint(intersects[0].object);
        console.log(intersects[0].object.userData.info.city_name);

        controls.target.set(city_object.x, city_object.y, city_object.z);
        controls.dollyIn(4);

        fadeOutOtherCities(intersects[0].object);
        enableCloseZoomBtn();
      }
    };

    function fadeOutOtherCities( selectedCity ) {
      var cityName = selectedCity.userData.info.city_name;

      scene.traverse(function( node ){
        if ( node instanceof THREE.Mesh ) {
          if ( node.userData.info.city_name !== cityName && node.userData.info.city_name !== 'black-board' ) {
            node.material.color.setHex('#000000');
          }
        }
      });
    };

    function enableCloseZoomBtn() {
      $('#close-city-zoom').show();
    };

    // On Close Button Click
    $('#close-city-zoom').on('click', function() {
      restoreCityColors();
      restoreCamera(camBackup.position, camBackup.rotation, camBackup.controlCenter);
      $('#close-city-zoom').hide();
      disableControls();
    });

    function restoreCityColors() {
      scene.traverse(function( node ){
        if ( node instanceof THREE.Mesh ) {
          // node.material.color.setHex(new THREE.Color(node.material.color));
          if ( node.userData.info.city_name !== 'black-board' ) {
            node.material.color.setStyle(node.userData.info.color);
          }
        }
      });
    };

    function restoreCamera(position, rotation, controlCenter){
      camera.position.set(position.x, position.y, position.z);
      camera.rotation.set(rotation.x, rotation.y, rotation.z);

      controls.center.set(controlCenter.x, controlCenter.y, controlCenter.z);
      controls.update();

      render();
    }

    function disableControls() {
      clickCounter = 0;
    };

    function getCenterPoint(mesh) {
      var middle = new THREE.Vector3();
      var geometry = mesh.geometry;

      geometry.computeBoundingBox();

      middle.x = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
      middle.y = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
      middle.z = (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;

      mesh.localToWorld( middle );
      return middle;
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
              INTERSECTED = null;
              INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
              INTERSECTED.material.color.setHex(0xff0000);
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

    var container = $("#property_card_list");
    container.html("");

    // Bind the JS template
    var compiled = _.template($('#property_card_slider').html());

    for (var i = 0; i < data.properties.length; i++) {
      var parsedHtml = compiled({
        data: data.properties[i]
      });

      container = $("#property_card_list");
      container.append(parsedHtml);
    }

    // bind the city naem
    var titleSection = $("#city_div");
    titleSection.html(data.city);


    $('#box-bottom-left').toggleClass('active');
    $('#box-right').toggleClass('active');
  }

  });
