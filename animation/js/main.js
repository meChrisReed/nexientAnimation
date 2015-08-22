(function () {
  requirejs.config({
      baseUrl: 'js/',
  });
  // usage example
  // require it in
  requirejs(['app/app'], function (nexientAnimation) {
    // initialize the system.
    // every function has a defaultParams object that shows the available params
    nexientAnimation.initialize({
      // fewer particles
      particles: {
        maxParticles: 125
      }

      // spread out across the screen
      // particles: {
      //   maxParticles: 150,
      //   lifeDuration: {
      //     min: 6,
      //     max: 14
      //   }
      // },
      // motion: {
      //   force: {
      //     min: 0.02,
      //     max: 0.7
      //   },
      //   timeToDestination: {
      //     min: 9,
      //     max: 18
      //   },
      // }
    });
    window.addEventListener('click', function () {
      // play the wind portion ofthe animation
      nexientAnimation.makeWind();
    });
  });
}());
