$(document).ready(function() {

  // Initializing variables
  var renderer, scene, camera, spotLight,
      plane, controls, group, loader;

  var mouse     = new THREE.Vector2(),
      raycaster = new THREE.Raycaster(),
      radius    = 100,
      theta     = 0,
      INTERSECTED;

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
    camera.position.set(0, 0, 1500 );

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
    controls.enableZoom = false;
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

});
