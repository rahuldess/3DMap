$(document).ready(function() {


  var initSVGObject = function() {
    var obj = {};
    obj.paths = [
      /// Taipei City
      "M366.2182,108.9780 L368.0329,110.3682 L367.5922,112.4411 L369.9258,116.0311 L368.9827,117.3543 " +
      "L371.5686,119.8491 L370.5599,121.7206 L372.9314,124.8009 L368.8889,126.7603 L369.2695,130.7622 " +
      "L366.1499,130.3388 L363.4698,128.1161 L362.9256,125.6018 L360.8153,126.4025 L360.2968,124.3588 " +
      "L361.9519,121.1623 L360.4475,118.7162 L358.1163,117.8678 L358.7094,115.7577 L361.6243,112.4576 Z",

      "M 213.1 6.7 c -32.4-14.4-73.7,0-88.1,30.6 C 110.6,4.9,67.5-9.5,36.9,6.7" +
      "C 2.8,22.9-13.4,62.4,13.5,110.9 C 33.3,145.1,67.5,170.3,125,217 c 59.3-46.7,93.5-71.9,111.5-106.1" +
      "C 263.4,64.2,247.2,22.9,213.1,6.7 z",

      // "M -378463.90230276587 -216828.5204525995 L -378463.90230276587 -216828.5204525995 L -378468.4733200769 -216800.78018946826" +
      // "L -378457.36255405867 -216726.32967956597 L -378453.2523036701 -216708.13985810167 L -378446.23084408935 -216645.84207578097" +
      // "L -378446.40886767313 -216640.48042431887 L -378440.04714254953 -216593.4246023558 L -378428.4180137435 -216539.991347306" +
      // "L -378408.5945640994 -216510.42896043573 L -378385.51956605876 -216467.31060126523 L -378379.14213297196 -216451.9325052259" +
      // "L -378359.4495830217 -216424.30743382534 L -378348.87288775464 -216401.72985462152 L -378333.6361633847 -216381.90640497737" +
      // "L -378337.86684149154 -216373.22513727797 L -378341.7990682963 -216369.96835289372 L -378342.2388912678 -216365.88428244408 " +
      // "L -378331.6883759395 -216327.93384318874 L -378324.9287157465 -216311.89601269213 L -378325.3318868038 -216300.2721198738 L" +
      // "-378321.78712309286 -216297.53893426526 L -378317.28940961056 -216296.21946535073 L -378303.3616821797 -216270.99771233014 L "+
      // " -378293.1933939575 -216243.98001550927 L -378293.88454434136 -216242.82286221522 L -378290.4863882877 -216243.61349636634 L" +
      // "-378276.29162548116 -216233.02632912374 L -378253.8973058489 -216247.0954282241 L -378224.3558629296 -216248.45678504065 L" +
      // "-378204.8989324284 -216228.3558280454 L -378170.660808492 -216241.304425766 L -378170.3675931776 -216235.0578923731" +
      // "L -378170.22622150823 -216232.0943233032 L -378169.26279976114 -216211.52212740996 L -378152.6542465991 -216208.78370581358" +
      // "L -378105.9858877301 -216201.0815678245 L -378090.63397162955 -216173.3308327178 L -378065.06664341706 -216168.73363546806" +
      // "L -378045.64636483014 -216185.9233832709 L -378059.37512472627 -216241.5662251538 L -378059.1971011426 -216244.0742632889" +
      // "L -378057.3906853668 -216269.52639977072 L -378057.05034616264 -216274.34874449397 L -378054.1391369704 -216315.39365251316" +
      // "L -378045.7615565607 -216328.4836219031 L -377993.89386184997 -216365.8895184318 L -377991.3072838986 -216367.75353007295 L -377955.1789683823 -216371.94232027777 L -377921.14504796837 -216364.08833864375 L -377920.3229978907 -216362.99925319053 L -377915.61584489804 -216367.39224691782 L -377913.6942373916 -216371.958028241 L -377932.8213006642 -216381.0267590344 L -377936.1670968403 -216393.19519457928 L -377929.9310354229 -216427.5799261728 L -377939.4710051143 -216469.85529131463 L -377948.89578307513 -216477.70927294862 L -377959.25780284416 -216480.447694545 L -377976.6465181818 -216485.03965580696 L -377979.7881108354 -216489.22844601178 L -377976.1229194062 -216505.46000805535 L -377983.93501313817 -216532.14783764756 L -377982.971591391 -216552.4215822387 L -378001.82638330036 -216597.61862854837 L -378000.06709141436 -216607.12194632547 L -378003.0044805454 -216615.18013148196 L -377994.6426080991 -216627.98212154533 L -377998.3287434793 -216637.62681099182 L -378000.4283745695 -216641.8679610742 L -378139.4071975765 -216833.3689772615 L -378144.8997487325 -216840.72030407088 L -378258.3531314292 -216996.0772967787 L -378439.5811396393 -216981.68356643748 L -378444.60768788506 -216944.65466102716 L -378449.5399883511 -216925.05112286875 L -378452.2784099475 -216906.3272306534 L -378452.4773774823 -216884.08475466596 L -378456.9332030626 -216867.26676199373 L -378459.5302529896 -216845.6735484881 L -378462.4571701452 -216837.2540801764 L -378463.90230276587 -216828.5204525995 "
    ];
    // obj.paths = ["M 213.1 6.7 c -32.4-14.4-73.7,0-88.1,30.6 C 110.6,4.9,67.5-9.5,36.9,6.7 C 2.8,22.9-13.4,62.4,13.5,110.9 C 33.3,145.1,67.5,170.3,125,217 c 59.3-46.7,93.5-71.9,111.5-106.1 C 263.4,64.2,247.2,22.9,213.1,6.7 z"];
    // obj.paths = ["M -378463.90230276587 -216828.5204525995 L -378463.90230276587 -216828.5204525995 L -378468.4733200769 -216800.78018946826 L -378457.36255405867 -216726.32967956597 L -378453.2523036701 -216708.13985810167 L -378446.23084408935 -216645.84207578097 L -378446.40886767313 -216640.48042431887 L -378440.04714254953 -216593.4246023558 L -378428.4180137435 -216539.991347306 L -378408.5945640994 -216510.42896043573 L -378385.51956605876 -216467.31060126523 L -378379.14213297196 -216451.9325052259 L -378359.4495830217 -216424.30743382534 L -378348.87288775464 -216401.72985462152 L -378333.6361633847 -216381.90640497737 L -378337.86684149154 -216373.22513727797 L -378341.7990682963 -216369.96835289372 L -378342.2388912678 -216365.88428244408 L -378331.6883759395 -216327.93384318874 L -378324.9287157465 -216311.89601269213 L -378325.3318868038 -216300.2721198738 L -378321.78712309286 -216297.53893426526 L -378317.28940961056 -216296.21946535073 L -378303.3616821797 -216270.99771233014 L -378293.1933939575 -216243.98001550927 L -378293.88454434136 -216242.82286221522 L -378290.4863882877 -216243.61349636634 L -378276.29162548116 -216233.02632912374 L -378253.8973058489 -216247.0954282241 L -378224.3558629296 -216248.45678504065 L -378204.8989324284 -216228.3558280454 L -378170.660808492 -216241.304425766 L -378170.3675931776 -216235.0578923731 L -378170.22622150823 -216232.0943233032 L -378169.26279976114 -216211.52212740996 L -378152.6542465991 -216208.78370581358 L -378105.9858877301 -216201.0815678245 L -378090.63397162955 -216173.3308327178 L -378065.06664341706 -216168.73363546806 L -378045.64636483014 -216185.9233832709 L -378059.37512472627 -216241.5662251538 L -378059.1971011426 -216244.0742632889 L -378057.3906853668 -216269.52639977072 L -378057.05034616264 -216274.34874449397 L -378054.1391369704 -216315.39365251316 L -378045.7615565607 -216328.4836219031 L -377993.89386184997 -216365.8895184318 L -377991.3072838986 -216367.75353007295 L -377955.1789683823 -216371.94232027777 L -377921.14504796837 -216364.08833864375 L -377920.3229978907 -216362.99925319053 L -377915.61584489804 -216367.39224691782 L -377913.6942373916 -216371.958028241 L -377932.8213006642 -216381.0267590344 L -377936.1670968403 -216393.19519457928 L -377929.9310354229 -216427.5799261728 L -377939.4710051143 -216469.85529131463 L -377948.89578307513 -216477.70927294862 L -377959.25780284416 -216480.447694545 L -377976.6465181818 -216485.03965580696 L -377979.7881108354 -216489.22844601178 L -377976.1229194062 -216505.46000805535 L -377983.93501313817 -216532.14783764756 L -377982.971591391 -216552.4215822387 L -378001.82638330036 -216597.61862854837 L -378000.06709141436 -216607.12194632547 L -378003.0044805454 -216615.18013148196 L -377994.6426080991 -216627.98212154533 L -377998.3287434793 -216637.62681099182 L -378000.4283745695 -216641.8679610742 L -378139.4071975765 -216833.3689772615 L -378144.8997487325 -216840.72030407088 L -378258.3531314292 -216996.0772967787 L -378439.5811396393 -216981.68356643748 L -378444.60768788506 -216944.65466102716 L -378449.5399883511 -216925.05112286875 L -378452.2784099475 -216906.3272306534 L -378452.4773774823 -216884.08475466596 L -378456.9332030626 -216867.26676199373 L -378459.5302529896 -216845.6735484881 L -378462.4571701452 -216837.2540801764 L -378463.90230276587 -216828.5204525995 "];
    obj.amounts = [ 22, 40, 21 ];
    obj.colors =  [ 0xC07000, 0xC08000, 0xC0A000 ];
    obj.center = { x:365, y:125 };
    return obj;
  };

  var addGeoObject = function( group, svgObject ) {
    var i, j, len, len1;
    var color, material, amount, simpleShapes, simpleShape, shape3d, x, toAdd, results = [];
    mesh = null;
    var thePaths   = svgObject.paths;
    var theAmounts = svgObject.amounts;
    var theColors  = svgObject.colors;
    var theCenter  = svgObject.center;
    len = thePaths.length;

    for (i = 0; i < len; ++i) {
      path = $d3g.transformSVGPath( thePaths[i] );

      color = new THREE.Color( theColors[i] );
      material = new THREE.MeshBasicMaterial({
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
        mesh.rotation.x = Math.PI;
        mesh.translateZ( - amount - 1);
        mesh.translateX( - theCenter.x);
        mesh.translateY( - theCenter.y);
        group.add(mesh);
      }
    }
  };


  var initMap = function(){
    // Set the renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor('#2E2E2E');
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    // Set Camera
    camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 0, 0, 200 );

    // Set the Scene
    scene = new THREE.Scene();

    // Create a group
    group = new THREE.Group();
    scene.add( group );

    // Get Geometry from SVG Path
    var obj = initSVGObject();
    addGeoObject( group, obj );

    // var domEvents   = new THREEx.DomEvents(camera, renderer.domElement);
    // domEvents.addEventListener(mesh, 'click', function(event){
    //   mesh.material.color.setHex(0xff0000);
    // }, false);

  };

  /// Events from extrude shapes example
  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  };

  function onDocumentMouseDown( event ) {
    event.preventDefault();
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'mouseout', onDocumentMouseOut, false );
    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;
  };

  function onDocumentMouseMove( event ) {
    mouseX = event.clientX - windowHalfX;
    targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
  };

  function onDocumentMouseUp( event ) {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
  };

  function onDocumentMouseOut( event ) {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
  };

  function onDocumentTouchStart( event ) {
    if ( event.touches.length == 1 ) {
      event.preventDefault();
      mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
      targetRotationOnMouseDown = targetRotation;
    }
  };

  function onDocumentTouchMove( event ) {
    if ( event.touches.length == 1 ) {
      event.preventDefault();
      mouseX = event.touches[ 0 ].pageX - windowHalfX;
      targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;
    }
  };

  function onDocumentMouseMoveTest(event){
    event.preventDefault();
    mouse.x =    ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y =  - ( event.clientY / window.innerHeight ) * 2 + 1;
  };

  function animate() {
    requestAnimationFrame( animate );
    render();
  };

  function render() {
    group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( scene.children, true );
    if ( intersects.length > 0 ) {
      if ( INTERSECTED != intersects[ 0 ].object ) {
        if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
        INTERSECTED = intersects[ 0 ].object;
        INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
        INTERSECTED.material.color.setHex( 0xff0000 );
      }
    } else {
      if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
      INTERSECTED = null;
    }
    renderer.render( scene, camera );
  };

  /// Main
  var renderer, scene, camera, group;
  var mouse = new THREE.Vector2();
  var raycaster = new THREE.Raycaster();
  var radius = 100, theta= 0;
  var INTERSECTED;

  var targetRotation = 0;
  var targetRotationOnMouseDown = 0;
  var mouseX = 0;
  var mouseXOnMouseDown = 0;
  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;
  var container = document.createElement( 'div' );
  document.body.appendChild( container );

  initMap();
  container.appendChild( renderer.domElement );

  document.addEventListener( 'mousemove', onDocumentMouseMoveTest, false );
  // document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  // document.addEventListener( 'touchstart', onDocumentTouchStart, false );
  // document.addEventListener( 'touchmove', onDocumentTouchMove, false );
  window.addEventListener( 'resize', onWindowResize, false );
  animate();

});
