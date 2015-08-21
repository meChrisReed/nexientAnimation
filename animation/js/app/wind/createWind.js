define([
  'app/globals',
  'app/wind/init'
], function (g) {
  var params,
    defaultParams = {
      wideWidth: window.innerWidth,
      narrowWidth: 1,
      height: window.innerWidth/4,
      segments: 10
    };

  return function (p) {
    var geometry,
      material;

    params = params || Object.assign(defaultParams, p);

    geometry = new THREE.CylinderGeometry(
      params.wideWidth,
      params.narrowWidth,
      params.height,
      params.segments
    );
    material = new THREE.MeshLambertMaterial({
      wireframe: true,
      side: THREE.DoubleSide,
      opacity: 0
    });
    g.windObject = new THREE.Mesh( geometry, material );
		g.scene.add( g.windObject );
    g.windObject.translateZ(window.innerWidth);
  };
});
