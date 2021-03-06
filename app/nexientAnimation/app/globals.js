import THREE from '../lib/THREE';

import Projector from '../vendor/renderers/Projector';
import CanvasRenderer from '../vendor/renderers/CanvasRenderer';

export default {
  interface: {
    mouseX: 0,
    mouseY: 0
  },
  dimentions: {
    windowHalfX: window.innerWidth / 2,
    windowHalfY: window.innerHeight / 2,
  },
  constants: {
  },

  currentTime: 0,

  camera: undefined,
  scene: undefined,
  renderer: undefined,
  clock: new THREE.Clock(),
  particles: [],
  particleSystem: undefined
};
