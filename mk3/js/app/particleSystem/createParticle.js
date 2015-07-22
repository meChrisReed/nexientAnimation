define(function () {
  var params;

  return function createParticle (g, p) {
    var particleAbstract,
      particle;
    p = p || {scale: {}};

    // cashe params
    if (!params) {
      params = {
        // intiger, particles alive at any moment
        maxParticles: p.maxParticles || 800,
        // furthest distrobution of particle start positions
        upperDistanceX: p.upperDistanceX || window.innerWidth/4,
        lowwerDistanceX: p.lowwerDistanceX || 5,
        // can take the strings 'distribute' or 'showEnds'
        sourcePlacementProgram: p.sourcePlacementProgram || 'distribute',
        // custom placement function
        // will be passed the axis as a string 'x','y','z'
        // must return an integer
        consumerCustomPlacmentProgram: p.consumerCustomPlacmentProgram || undefined,
        // particle scale
        scale: {
          min: p.scale.min || 5,
          max: p.scale.max || 35
        }
      };
    }
    // adition methods and computed properties to help create a particle
    particleAbstract = {
      // start position placement functions
      // return intiger
      placement: {
        showEnds: function () {
          return Math.round(Math.random()) % 2 ? params.upperDistanceX : -params.upperDistanceX;
        },
        distribute: function () {
          var invert = Math.round(Math.random()) % 2 ? -1 : 1;
          return Math.round(Math.random() * params.upperDistanceX * invert + params.lowwerDistanceX);
        }
      },
      material: {
        newColor: function () {
          return new THREE.Color().setHSL(0.039,1,0.5);
        },
        drawTri: function (context) {
          var direction = Math.round(Math.random()) % 2 ? 1 : -1;
          return function (context) {
            var h = Math.sqrt(3)/2;

            context.beginPath();
            context.lineTo( direction / 2, h / 2);
            context.lineTo( direction / 2, -h / 2);
            context.lineTo(-1*direction * h / 2, 0);
            context.fill();
          };
        }
      },
      // scale: variation computed once per particle
      scale: (function () {
        return Math.random() * params.scale.max - params.scale.min + params.scale.min;
      }())
    };

    particle = new THREE.Sprite(
      new THREE.SpriteCanvasMaterial({
        color: particleAbstract.material.newColor(),
        program: particleAbstract.material.drawTri()
      })
    );

    if (params.consumerCustomPlacmentProgram) {
      particle.position.set(
        params.consumerCustomPlacmentProgram('x'),
        params.consumerCustomPlacmentProgram('y'),
        params.consumerCustomPlacmentProgram('z')
      );
    } else {
      particle.position.set(
        particleAbstract.placement[params.sourcePlacementProgram](),
        0,
        0
      );
    }

    particle.originalScale = particleAbstract.scale;

    particle.scale.set(
      particleAbstract.scale,  // x
      particleAbstract.scale, // y
      particleAbstract.scale // z
    );
    g.scene.add(particle);
    g.particles.push(particle);

    if (g.particles.length < params.maxParticles) {
      return createParticle(g);
    }
  };
});
