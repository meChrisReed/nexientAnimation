import globals from './globals';
import createScene from './scene';
import createLights from './lights';
import createParticle from './particleSystem/createParticle';
import motion from './particleSystem/motion';
import createWind from './wind/createWind';
import windInit from './wind/init';

function initialize (params) {
  var defaultParams = {
    particles: {
      maxParticles: 150,
      // furthest distrobution of particle start positions
      upperDistanceX: window.innerWidth/4,
      lowwerDistanceX: 5,
      // can take the strings 'distribute' or 'showEnds'
      sourcePlacementProgram: 'distribute',
      // particle scale
      scale: {
        min: 5,
        max: 30
      },
      lifeDuration: {
        min: 2,
        max: 7
      }
    },
    wind: {

    },
    motion: {
      noise: {
        // resistance to moving along an axis
        invertionFriction: {
          x: 0.9, // reduce the movement along the x axis
          y: 0.3,
          z: 0.3
        }
      },
      force: {
        min: 0.02,
        max: 0.8
      },
      timeToDestination: {
        min: 7,
        max: 14
      },
      wind: {
        forceMultiplier: 60,
        noiseDurationMultiplier: 1,
        moveSpeed: 20
      }
    }
  };

  params = Object.assign(defaultParams, params);

  // cerate scene
  createScene();
  createLights();

  // add particles to the scene with some basic properties
  createParticle(params.particles);

  // add wind CylinderGeometry to the scene with some absic properties
  createWind(params.wind);

  globals.clock.start();
  (function render() {
    requestAnimationFrame( render );

    globals.deltaTime = globals.clock.getDelta();
    globals.currentTime += globals.deltaTime;

    globals.scene.updateMatrixWorld();

    motion(params.motion);
    globals.renderer.render( globals.scene, globals.camera );
  }());
}

export default {
  initialize: initialize,
  makeWind: windInit
};
