$(document).ready(function() {

  // Initializing variables
  var renderer, scene, camera, spotLight,
      plane, controls, group, loader;

  var mouse     = new THREE.Vector2(),
      raycaster = new THREE.Raycaster(),
      radius    = 100,
      theta     = 0,
      INTERSECTED;
  // var pointsData = [
  //   [37.272272, -121.752132],
  //   [37.277563, -121.779046],
  //   [37.266648, -121.853346],
  //   [37.260166, -121.906441],
  //   [37.401047, -121.950821],
  //   [37.373218, -122.073465]
  // ]
  var pointsData = [
    [37.38122, -121.98051],
    [37.40357, -121.96952]
  ]
  // Canvas will be attached to this DIV element created
  var container = document.createElement( 'div' );
  document.body.appendChild( container );

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
  addDensityData(pointsData);


  function initMap(){
    // Sets the renderer, which basically renders (scene + camera) together
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor('#ececec');
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    // Creates a canvas, which gets attached to DIV element created above
    container.appendChild( renderer.domElement );

    // Sets the camera.
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set(0, -700, 1500 );

    // Sets the Scene
    scene = new THREE.Scene();

    // Create a group
    group = new THREE.Group();
    scene.add( group );

    spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set(0, 0, 1300 );
    scene.add( spotLight );

    // This is for big plane which is at back of all our city geometries.
    var planGeometry  = new THREE.PlaneGeometry(2000, 1500, 10 );
    var planeMaterial = new THREE.MeshBasicMaterial( {color: 'black', side: THREE.DoubleSide} );
        plane         = new THREE.Mesh( planGeometry, planeMaterial );
    group.add( plane );

    // Get the shapeGeometry from SVG path's
    initSVGObject().done(function(data) {
      addGeoObject( group, data );
    });
  };

  function trackMovement() {
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render );
    controls.enableZoom = true;
  };

  function initSVGObject() {
    return $.ajax({ url: 'load_city_data' });
  };

  // Add the Shape Geometries with properties to the group
  function addGeoObject( group, svgObject ) {
    var i, j, len, len1;
    var mesh, color, material, amount, simpleShapes, simpleShape, shape3d, x, toAdd, results = [];
    var thePaths   = svgObject.paths;
    var theAmounts = svgObject.amounts;
    var theColors  = svgObject.colors;
    var theCenter  = svgObject.center;
    var theInfo    = svgObject.info;
    len = thePaths.length;

    for (i = 0; i < len; ++i) {
      path = $d3g.transformSVGPath( thePaths[i] );

      color = new THREE.Color( theColors[i] );
      material = new THREE.MeshPhongMaterial({ color: color });

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
        mesh.scale.set(0.5635568066383669, 0.5635568066383669, 1 );
        mesh.translateZ( - amount - 1);
        mesh.translateX( - theCenter.x);
        mesh.translateY( - theCenter.y);
        group.add(mesh);
      }
    }
  };


  function eventListeners(){
    window.addEventListener( 'resize', onWindowResize, false );

    // check if hovered over cities
    window.addEventListener( 'mousemove', onDocumentMouseMove, true );
  };


  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  };

  function onDocumentMouseMove(event){
    event.preventDefault();
    mouse.x =    ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y =  - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycasting();
  };

  function animate() {
    requestAnimationFrame( animate );
    controls.update();
    render();
  };

  function render() {
    renderer.render( scene, camera );
  };

  function raycasting() {
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( scene.children, true );

    if ( intersects.length > 0 ) {
      if ( INTERSECTED != intersects[ 0 ].object ) {
        if ( INTERSECTED ) {
          INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
        }

        INTERSECTED = intersects[ 0 ].object;
        console.log(INTERSECTED.info);
        INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
        INTERSECTED.material.color.setHex( 0xff0000 );
      }
    } else {
      if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
      INTERSECTED = null;
    }
  };
  function addDensityData(data) {
    window.pos = [];
    var geom = new THREE.Geometry();

    var cubeMat = new THREE.MeshLambertMaterial({
      color: 0x000000,
      opacity: 0.6,
      emissive: 0xffffff
    });

    for (var i = 0; i < data.length; i++) {

      // var x = data[i][0] * (Math.PI / 180);
      // var y = data[i][1] * (Math.PI / 180);
      var x = data[i][0];
      var y = data[i][1];
      // var position = latLongToVector3(x, y);
      var postion = latLngToPointXY(x, y)

      // window.pos.push(position); // for debugging purpose.

      // var cube = new THREE.Mesh(new THREE.CubeGeometry(50, 50, 300, 1, 1,
      //   1,
      //   cubeMat));

      // position the cube correctly
      // cube.position.set(position["x"], position["y"], position["z"]);
      //
      // console.log(cube);
      // scene.add(cube);

    }
  }

function latLngToPointXY(lat, lng) {
  // [37.38122, -121.98051]
  // per 0.00001 in svg
  const Y_UNIT = 0.05268209219, X_UNIT = 0.05235987756;
  const PIVOT_POINT = [37.36261, -122.08903]; // (y , x)
  const POVOT_POINT_SVG =[43.30236423376482,69.81056448139134]; //(x, y)

  // var newY = (lat - PIVOT_POINT[0]) * Y_UNIT * 100000
  // var newX = (lng - PIVOT_POINT[1]) * X_UNIT * 100000
  var newY = POVOT_POINT_SVG[1] - (lat - PIVOT_POINT[0]) * Y_UNIT * 100000
  var newX = POVOT_POINT_SVG[0] + (lng - PIVOT_POINT[1]) * X_UNIT * 100000

  // console.log(newX)
  // console.log(newY)

  svgToPlot = "M,"+newX+","+newY+", L,"+(newX+20)+","+(newY)+", L,"+(newX+20)+","+(newY+20)+", L,"+(newX)+","+(newY)+", L,"+(newX)+","+(newY);
  path = $d3g.transformSVGPath(svgToPlot);
  // color = new THREE.Color( theColors[i] );
  material = new THREE.MeshPhongMaterial({ color: "green" });
  simpleShapes = path.toShapes(true);
  for (j = 0; j < simpleShapes.length; ++j) {
    simpleShape = simpleShapes[j];
    shape3d = simpleShape.extrude({
      amount: 200,
      bevelEnabled: false
    });
  }
  mesh = new THREE.Mesh(shape3d, material);
  group.add(mesh)
  mesh.rotation.x = Math.PI;
  mesh.scale.set(0.5635568066383669, 0.5635568066383669, 1 );
  mesh.translateZ( - 80 - 1);
  mesh.translateX( - 600);
  mesh.translateY( - 150);
  return true;
}

function latLngFun(lat, lng) {
    var radius = 60;
    var vectorLoc = {};

    vectorLoc["x"] = Math.abs(Math.sin(lat) * Math.sin(lng));
    vectorLoc["y"] = Math.abs(Math.cos(lat));
    vectorLoc["z"] = Math.abs(Math.sin(lat) * Math.cos(lng));
    return vectorLoc;
  }

  function latLngFun2(lat, lon) {
    var vectorLoc = {};
    var cosLat = Math.cos(lat * Math.PI / 180.0);
    var sinLat = Math.sin(lat * Math.PI / 180.0);
    var cosLon = Math.cos(lon * Math.PI / 180.0);
    var sinLon = Math.sin(lon * Math.PI / 180.0);
    var rad = 1.0;

    vectorLoc["x"] = rad * cosLat * cosLon;
    vectorLoc["y"] = rad * cosLat * sinLon;
    vectorLoc["z"] = rad * sinLat;
    return vectorLoc;
  }


  function latLongToVector3(lat, lon) {
    var radius = 60;
    var heigth = 2;
    var vectorLoc = {};

    var phi = (lat) * Math.PI / 180;
    var theta = (lon - 180) * Math.PI / 180;

    var x = -(radius + heigth) * Math.cos(phi) * Math.cos(theta);
    var y = (radius + heigth) * Math.sin(phi);
    var z = (radius + heigth) * Math.cos(phi) * Math.sin(theta);

    vectorLoc["x"] = x;
    vectorLoc["y"] = y;
    vectorLoc["z"] = z;
    return vectorLoc;
  }

});
