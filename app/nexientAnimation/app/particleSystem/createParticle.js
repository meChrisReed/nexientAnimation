import g from '../globals';
import init from './init';

// cache-able parameters
var params,
defaultParams = {
  // intiger, total particles in the scene
  maxParticles: 300
};;

// TODO This function is invalid
// its type signature is (p) => g -> undefined
// it mutates the particle store property of g
export default function createParticle (p) {
  // cashe params
  params = params || Object.assign(defaultParams, p);

  // aditional methods and computed properties to help create a particle
  const particleAbstract = {
    material: {
      nexientOrange: new THREE.Color().setHSL(0.0888,1,0.5),

      newColor: () => new THREE.Color().setHSL(Math.random(),1,0.5),

      drawTri: context => {
        var direction = Math.round(Math.random()) % 2 ? 1 : -1;
        return context => {
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

  let particle = new THREE.Sprite(
    new THREE.SpriteCanvasMaterial({
      // debug program
      // color: particleAbstract.material.newColor(),
      color: particleAbstract.material.nexientOrange,
      program: particleAbstract.material.drawTri()
    })
  );
  particle.originalColor = particleAbstract.material.nexientOrange;

  // TODO remove mutation
  g.scene.add(particle);
  // TODO remove mutation
  g.particles.push(particle);
  init(particle, params);

  if (g.particles.length < params.maxParticles) {
    return createParticle(g);
  }
};
