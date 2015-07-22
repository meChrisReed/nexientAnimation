define(function () {
  var globals = {
    interface: {
      mouseX: 0,
      mouseY: 0
    },
    dimentions: {
      windowHalfX: window.innerWidth / 2,
      windowHalfY: window.innerHeight / 2,
    },
    constants: {
    },

    camera: undefined,
    scene: undefined,
    renderer: undefined,
    clock: undefined,
    particles: undefined,
    particleSystem: undefined
  };

  // cerate scene
  require([
    'app/scene',
    'app/lights',
    'app/particleSystem/createParticle',
    'app/particleSystem/motion'
  ], function (
    createScene,
    createLights,
    createParticle,
    motion
  ) {
    createScene(globals);
    createLights(globals);

    // initializeParticles
    globals.particles = [];
    createParticle(globals);

    (function render() {
      requestAnimationFrame( render );
      motion(globals, createParticle);
      globals.renderer.render( globals.scene, globals.camera );
    }());
  });
});
