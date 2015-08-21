
define([
  'app/globals',
  'app/scene',
  'app/lights',
  'app/particleSystem/createParticle',
  'app/particleSystem/motion',
  'app/wind/createWind',
  'app/wind/init',
  'app/polyfill-assign'
],function (
  globals,
  createScene,
  createLights,
  createParticle,
  motion,
  createWind,
  windInit
) {
  globals = Object.assign(globals, {
    clock: new THREE.Clock(),
    particles: []
  });

  // cerate scene
  createScene();
  createLights();

  // initialize particles
  createParticle({maxParticles: 125});

  // initialize wind CylinderGeometry
  createWind();

  globals.clock.start();
  (function render() {
    requestAnimationFrame( render );

    globals.deltaTime = globals.clock.getDelta();
    globals.currentTime += globals.deltaTime;

    globals.scene.updateMatrixWorld();

    // TESTING
    (function cylinderStuff () {
      globals.windObject.translateY(-20);
    }());

    motion();
    globals.renderer.render( globals.scene, globals.camera );
  }());

  return {
    play: function () {
      windInit();
    }
  };
});
