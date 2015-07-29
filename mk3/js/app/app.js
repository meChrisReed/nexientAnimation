
define([
  'app/globals',
  'app/scene',
  'app/lights',
  'app/particleSystem/createParticle',
  'app/particleSystem/motion',
  'app/polyfill-assign'
],function (
  globals,
  createScene,
  createLights,
  createParticle,
  motion
) {
  globals = Object.assign(globals, {
    clock: new THREE.Clock(),
    particles: []
  });

  // cerate scene
  createScene();
  createLights();

  // initialize particles
  createParticle({maxParticles: 300});

  // initialize wind CylinderGeometry
  (function () {
    var geometry = new THREE.CylinderGeometry(window.innerWidth/10, 1, window.innerWidth/10, 10 );
    var material = new THREE.MeshLambertMaterial({
      wireframe: true,
      side: THREE.DoubleSide,
      opacity: 1
    });
    globals.windObject = new THREE.Mesh( geometry, material );
    globals.windObject.trackingPointWide = new THREE.Vector3(0, window.innerWidth/10, 0);
    globals.windObject.trackingPointNarrow = new THREE.Vector3(0, 0, 0);
		globals.scene.add( globals.windObject );
  }());

  globals.clock.start();
  (function render() {
    requestAnimationFrame( render );

    globals.deltaTime = globals.clock.getDelta();
    globals.currentTime += globals.deltaTime;

    globals.scene.updateMatrixWorld();

    // TESTING
    (function cylinderStuff () {
      globals.windObject.rotateX(globals.deltaTime/2);
      globals.windObject.rotateY(globals.deltaTime/2);
      globals.windObject.rotateZ(globals.deltaTime/2);
    }());

    motion();
    globals.renderer.render( globals.scene, globals.camera );
  }());
});
