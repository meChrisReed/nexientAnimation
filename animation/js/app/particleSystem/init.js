define(['app/globals'], function (g) {
  var params,
    defaultParams = {
    // furthest distrobution of particle start positions
    // TEST VALUE = window.innerWidth/8 was window.innerWidth/4
    upperDistanceX: window.innerWidth/4,
    lowwerDistanceX: 5,
    // can take the strings 'distribute' or 'showEnds'
    sourcePlacementProgram: 'distribute',
    // particle scale
    scale: {
      min: 5,
      max: 40
    },
    lifeDuration: {
      min: 2,
      max: 6
    }
  };
  return function (particle, p) {
    var particleAbstract;
    params = params || Object.assign(defaultParams, p);

    // aditional methods and computed properties to help create a particle
    particleAbstract = {
      // start position placement programs
      placement: {
        // return intiger
        showEnds: function () {
          return Math.round(Math.random()) % 2 ? params.upperDistanceX : -params.upperDistanceX;
        },
        // return intiger
        distribute: function () {
          var invert = Math.round(Math.random()) % 2 ? -1 : 1;
          return Math.round(Math.random() * params.upperDistanceX * invert);
        }
      },
      // scale: variation computed once per particle
      scale: (function () {
        return Math.random() * (params.scale.max - params.scale.min) + params.scale.min;
      }())
    };

    (function resetLifeCycle () {
      particle.material.color = particle.originalColor;
      particle.originalScale = particleAbstract.scale;
      particle.originalLife = Math.random() * (params.lifeDuration.max - params.lifeDuration.min) + params.lifeDuration.min;
      particle.lifeRemaining = particle.originalLife;

      particle.remainingNoise = 0;
      particle.initialVector = {};

      particle.wind = {
        forceMultiplier: 1,
        noiseDurationMultiplier: 1
      };
    }());

    (function initializeProperties () {
      particle.position.set( particleAbstract.placement[params.sourcePlacementProgram](), 0, 0 );
      particle.scale.set( particleAbstract.scale, particleAbstract.scale, particleAbstract.scale );
    }());
  };
});
