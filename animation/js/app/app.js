
define([
  'app/globals',
  'app/scene',
  'app/lights',
  'app/particleSystem/createParticle',
  'app/particleSystem/motion',
  'app/wind/createWind',
  'app/wind/init',
  'app/polyfill-assign',
  'vendor/three.min'
],function (
  globals,
  createScene,
  createLights,
  createParticle,
  motion,
  createWind,
  windInit
) {
  function initialize (params) {
    requirejs(['vendor/renderers/Projector', 'vendor/renderers/CanvasRenderer'], function () {
      var defaultParams = {
        particles: {},
        wind: {},
        motion: {}
      };

      params = Object.assign(defaultParams, params);

      globals = Object.assign(globals, {
        clock: new THREE.Clock(),
        particles: []
      });

      // cerate scene
      createScene();
      createLights();

      // add particles to the scene with some basic properties
      createParticle(params.particles);

      // add wind CylinderGeometry to the scene with some absic properties
      createWind(params.wind);

      globals.clock.start();
      (function render() {
        requestAnimationFrame( render );

        globals.deltaTime = globals.clock.getDelta();
        globals.currentTime += globals.deltaTime;

        globals.scene.updateMatrixWorld();

        motion(params.motion);
        globals.renderer.render( globals.scene, globals.camera );
      }());
    });
  }

  return {
    initialize: initialize,
    makeWind: windInit
  };
});
