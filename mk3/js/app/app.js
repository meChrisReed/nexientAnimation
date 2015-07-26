
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

  globals.clock.start();
  (function render() {
    globals.deltaTime = globals.clock.getDelta();
    globals.currentTime += globals.deltaTime;

    requestAnimationFrame( render );
    motion();
    globals.renderer.render( globals.scene, globals.camera );
  }());
});
