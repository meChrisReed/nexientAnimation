(function () {
  requirejs.config({
      baseUrl: 'js/',
  });

  requirejs(['app/app'], function (nexientAnimation) {
    window.addEventListener('click', function () {
      nexientAnimation.play();
    });
  });
}());
