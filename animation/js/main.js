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
      particles: {
        maxParticles: 125
      }
    });
    window.addEventListener('click', function () {
      // play the wind portion ofthe animation
      nexientAnimation.makeWind();
    });
  });
}());
