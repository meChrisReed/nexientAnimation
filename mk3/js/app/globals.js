define(function () {
  return {
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

    currentTime: 0,

    camera: undefined,
    scene: undefined,
    renderer: undefined,
    clock: undefined,
    particles: undefined,
    particleSystem: undefined
  };
});
