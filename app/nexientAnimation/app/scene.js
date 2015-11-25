var THREE = window.THREE;

import g from './globals';

export default function createScene () {
  var container = document.createElement('div');

  document.body.appendChild(container);

  g.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  g.camera.position.z = 200;

  console.log('g', g);

  g.scene = new THREE.Scene();

  g.renderer = new THREE.CanvasRenderer();
  g.renderer.setPixelRatio( window.devicePixelRatio );
  g.renderer.setSize( window.innerWidth, window.innerHeight );
  g.renderer.setClearColor( 0xffffff, 1);
  container.appendChild( g.renderer.domElement );
};
