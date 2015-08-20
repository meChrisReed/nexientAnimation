define(['app/globals', 'app/particleSystem/init'],function (g, init) {
  var params,
  raycaster = new THREE.Raycaster(),
    defaultParams = {
      noise: {
        invertionFriction: {
          x: 0.9,
          y: 0.3,
          z: 0.3
        }
      },
      force: {
        min: 0.01,
        max: 0.7
      },
      timeToDestination: {
        min: 7,
        max: 14
      },
      wind: {
        forceMultiplier: 60,
        noiseDurationMultiplier: 1
      }
    };

    function matchPolarity (a, b) {
      if (
        (a >= 0 && b >= 0) ||
        (a < 0 && b < 0)
      ) {
        return true;
      }
    }
    function setNoise (particle) {
      var fluxValues = {},
        force = Math.random() * (params.force.max - params.force.min) + params.force.min;

      particle.initialVector = particle.initialVector || {};

      Object.keys(params.noise.invertionFriction).forEach(function (axis) {
        var baseFlux = Math.random() * (params.force.max * particle.wind.forceMultiplier - params.force.min) + params.force.min * particle.wind.forceMultiplier,
          intermediate =  Math.round(baseFlux * 10),
          invert = intermediate % 2 ? -1 : 1;

        // compare force * invert with initialVector
        particle.initialVector[axis] = particle.initialVector[axis] || baseFlux * invert;
        if (!matchPolarity(baseFlux * invert, particle.initialVector[axis])) {
          invert *= params.noise.invertionFriction[axis];
        }
        fluxValues[axis] = baseFlux * invert;
      });
      particle.lastPosition = particle.position;
      particle.noiseDuration = (
        particle.noiseDuration || Math.random() * (
          params.timeToDestination.max - params.timeToDestination.min
        ) + params.timeToDestination.min
      ) * particle.wind.noiseDurationMultiplier;
      particle.remainingNoise = particle.noiseDuration;
      particle.noiseVector = fluxValues;
    }

  return function (p) {
    params = params || Object.assign(defaultParams, p);

    g.particles.forEach(function (particle) {
      particle.lifeRemaining -= g.deltaTime;
      particle.remainingNoise -= g.deltaTime;

      // check for intersection
      var castLocation = g.windObject.getWorldPosition( 0, 0, 0 );
      raycaster.far = particle.position.distanceTo(castLocation);
      raycaster.set(
        castLocation,
        particle.position
      );
      // If there is no intersection.
      // The particle is inside of the cylinder
      var intersects = raycaster.intersectObjects( [g.windObject] );
      if (intersects[0]) {
        // particle.material.color = particle.originalColor;
      } else {
        particle.material.color = new THREE.Color().setHSL(0.5,1,0.4);
        particle.wind = params.wind;
        particle.remainingNoise = -1;
      }

      if (particle.lifeRemaining <= 0) {
        return init(particle);
      }
      (function handleLifeCycleAttributes () {
        var ratio,
          percentComplete,
          updatedScale;

        ratio = particle.lifeRemaining / particle.originalLife;
        percentComplete = 1 - ratio;

        // scale up from 0 -> 1
        // over the first 40% of life
        // and down over the last 50% of life
        if (percentComplete <= 0.4) {
          updatedScale = particle.originalScale*(percentComplete*2.5);
          particle.scale.set(updatedScale, updatedScale, updatedScale);
        } else if (percentComplete >= 0.5){
          updatedScale = particle.originalScale*(ratio*2);
          particle.scale.set(updatedScale, updatedScale, updatedScale);
        }
        particle.material.opacity = ratio;
      }());
      if (particle.remainingNoise <= 0) {
        setNoise(particle);
      }
      (function movePArticle () {
        var ratio,
          percentComplete;

        ratio = particle.remainingNoise / particle.noiseDuration;
        percentComplete = 1 - ratio;

        particle.position.set(
          particle.lastPosition.x + (particle.noiseVector.x * percentComplete),
          particle.lastPosition.y + (particle.noiseVector.y * percentComplete),
          particle.lastPosition.z + (particle.noiseVector.z * percentComplete)
        );
      }());
    });
  };
});
