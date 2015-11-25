import g from '../globals';

var params,
  defaultParams = {
    // furthest distrobution of particle start positions
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

export default function (particle, p) {
  // initialize parameters
  params = params || Object.assign(defaultParams, p);

  // additional methods and computed properties to help create a particle
  const particleAbstract = {
    // placement: particle start position placement programs
    placement: {
      // () => integer
      showEnds: () => Math.round(Math.random()) % 2 ? params.upperDistanceX : -params.upperDistanceX,
      // () => integer
      distribute: () => {
        var invert = Math.round(Math.random()) % 2 ? -1 : 1;
        return Math.round(Math.random() * params.upperDistanceX * invert);
      }
    },
    // scale: variation computed once per particle
    // () => integer
    scale: (function () {
      return Math.random() * (params.scale.max - params.scale.min) + params.scale.min;
    }())
  };

  // TODO this is a state thing that will need to be made immutable with Redux
  // There is a
  // particles are never removed from the scene instead there life cycle is reset when they "die"
  (function resetLifeCycle () {
    particle.material.color = particle.originalColor;
    particle.originalScale = particleAbstract.scale;
    particle.originalLife = Math.random() * (params.lifeDuration.max - params.lifeDuration.min) + params.lifeDuration.min;
    particle.lifeRemaining = particle.originalLife;
    particle.hasIntersected = false;

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
