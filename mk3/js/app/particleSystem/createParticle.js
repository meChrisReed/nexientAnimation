define([
  'app/globals',
  'app/particleSystem/init'
],function (g, init) {
  var params,
    defaultParams = {
      // intiger, particles alive at any moment
      maxParticles: 10
    };

  return function createParticle (p) {
    var particleAbstract,
      particle;

    // cashe params
    params = params || Object.assign(defaultParams, p);

    // aditional methods and computed properties to help create a particle
    particleAbstract = {
      material: {
        nexientOrange: new THREE.Color().setHSL(0.039,1,0.5),

        newColor: function () {
          return new THREE.Color().setHSL(Math.random(),1,0.5);
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
      }
    };

    // TODO look into not using mulltiple materials
    particle = Object.assign(
      new THREE.Sprite(
        new THREE.SpriteCanvasMaterial({
          // debug program
          // color: particleAbstract.material.newColor(),
          color: particleAbstract.material.nexientOrange,
          program: particleAbstract.material.drawTri()
        })
      )
    );

    g.scene.add(particle);
    g.particles.push(particle);
    init(particle);

    if (g.particles.length < params.maxParticles) {
      return createParticle(g);
    }
  };
});
