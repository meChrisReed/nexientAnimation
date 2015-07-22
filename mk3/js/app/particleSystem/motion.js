define(function () {
  var params,
    createParticle;

    function matchPolarity (a, b) {
      if (
        (a >= 0 && b >= 0) ||
        (a < 0 && b < 0)
      ) {
        return true;
      }
    }

  return function (g, createParticleProgram, p) {
    p = p || {
      noise:{invertionFriction:{}},
      force: {}
    };
    var motion;
    if (!params) {
      params = {
        noise: {
          invertionFriction: {
            x: p.noise.invertionFriction.x || 0.9,
            y: p.noise.invertionFriction.y || 0.3,
            z: p.noise.invertionFriction.z || 0.3
          }
        },
        force: {
          min: p.force.min || 5,
          max: p.force.max || 15
        }
      };
    }
    if (!createParticle) {
      createParticle = createParticleProgram || require(['app/particleSystem/createParticle']);
    }
    motion = {
      noise: function (particle) {
        var fluxValues = {},
          force = Math.random() * params.force.max - params.force.min + params.force.min;

        particle.initialVector = particle.initialVector || {};

        Object.keys(params.noise.invertionFriction).forEach(function (axis) {
          var baseFlux = Math.round(Math.random() * force),
            invert = baseFlux % 2 ? -1 : 1;

          // compare baseFlux * invert with initialVector
          particle.initialVector[axis] = particle.initialVector[axis] || baseFlux * invert;
          if (!matchPolarity(baseFlux * invert, particle.initialVector[axis])) {
            invert *= params.noise.invertionFriction[axis];
          }
          fluxValues[axis] = baseFlux * invert;
        });
        return fluxValues;
      }
    };

    g.particles.forEach(function (particle) {
      if (
        particle.noiseDestination &&
        particle.noiseDuration > particle.startNoiseTransitionTime.getElapsedTime() * 10000
      ) {
        (function () {
          // get the amount to move based on the amount of time that has passed
          var elapsedTime = particle.startNoiseTransitionTime.getElapsedTime() * 10000;
          var movement;

          if (particle.lifeDuration < particle.life.getElapsedTime()) {
            g.scene.remove(particle);
            g.particles.splice(g.particles.indexOf(particle), 1);
            return createParticle(g);
          }
          var ratio = (particle.life.getElapsedTime() / particle.lifeDuration);
          var lifeRemainaing = 1 - ratio;
          particle.material.opacity = lifeRemainaing;
          var updatedScale = ((particle.originalScale) * (lifeRemainaing));
          particle.scale.set(updatedScale, updatedScale,  updatedScale);
          movement = elapsedTime/particle.noiseDuration;

          particle.position.x += (particle.noiseDestination.x - particle.position.x) * movement;
          particle.position.y += (particle.noiseDestination.y - particle.position.y) * movement;
          particle.position.z += (particle.noiseDestination.z - particle.position.z) * movement;
        }());
      } else {
        (function setNewNoiseDestination () {

          var noiseValues = motion.noise(particle);

          particle.noiseDestination = {
            x: particle.position.x + noiseValues.x,
            y: particle.position.y + noiseValues.y,
            z: particle.position.z + noiseValues.z
          };

          // refactor out all the clocks into one global clock
          particle.startNoiseTransitionTime = new THREE.Clock();
          particle.startNoiseTransitionTime.start();
          particle.noiseDuration = Math.round(Math.random() * 4000) + 200; // in miliseconds
        }());
        if (!particle.life) {
          // refactor out all the clocks into one global clock
          particle.life =  new THREE.Clock();
          particle.life.start();

          particle.lifeDuration = (Math.random() * 3) + 1; // in mils
        }
      }
    });
  };
});
