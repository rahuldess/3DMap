$(document).ready(function() {

  // Initializing variables
  var renderer, scene, camera, spotLight,
    plane, controls, group, loader;

  var mouse = new THREE.Vector2(),
    raycaster = new THREE.Raycaster(),
    radius = 100,
    theta = 0,
    INTERSECTED;

  var pointsData = [
    [37.272272, -121.752132],
    [37.277563, -121.779046],
    [37.266648, -121.853346],
    [37.260166, -121.906441]
  ]

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

  addDensityData(pointsData);

  // simple function that converts the density data to the markers on screen
  function addDensityData(data) {
    window.pos = [];
    var geom = new THREE.Geometry();

    var cubeMat = new THREE.MeshLambertMaterial({
      color: 0x000000,
      opacity: 0.6,
      emissive: 0xffffff
    });

    for (var i = 0; i < data.length; i++) {

      var x = data[i][0] * (Math.PI / 180);
      var y = data[i][1] * (Math.PI / 180);
      var position = lonLatToVector3(x, y);

      window.pos.push(position); // for debugging purpose.

      var cube = new THREE.Mesh(new THREE.CubeGeometry(50, 50, 300, 1, 1,
        1,
        cubeMat));

      // position the cube correctly
      cube.position = position;
      // cube.lookAt(new THREE.Vector3(0, 0, 0));
      console.log(cube);
      scene.add(cube);

    }
  }

  function lonLatToVector3(lat, lng, out) {
    out = out || new THREE.Vector3();
    var radius = 600;
    //flips the Y axis
    // lat = Math.PI / 2 - lat;

    //distribute to sphere
    out.set(
      Math.cos(lat) * Math.cos(lng) * -radius,
      Math.sin(lat) * radius,
      Math.cos(lat) * Math.sin(lng) * radius
    );

    // out.set(
    //   Math.sin(lat) * Math.sin(lng),
    //   Math.cos(lat),
    //   Math.sin(lat) * Math.cos(lng)
    // );

    return out;
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
    camera.position.set(0, 0, 1500);

    // Sets the Scene
    scene = new THREE.Scene();

    // Create a group
    group = new THREE.Group();
    scene.add(group);

    spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 0, 1300);
    scene.add(spotLight);

    // This is for big plane which is at back of all our city geometries.
    var planGeometry = new THREE.PlaneGeometry(2000, 1500, 10);
    var planeMaterial = new THREE.MeshBasicMaterial({
      color: 'black',
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

  function raycasting() {
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      if (INTERSECTED != intersects[0].object) {
        if (INTERSECTED) {
          INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
        }

        INTERSECTED = intersects[0].object;
        console.log(INTERSECTED.info);
        INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
        INTERSECTED.material.color.setHex(0xff0000);
      }
    } else {
      if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
      INTERSECTED = null;
    }
  };

});
