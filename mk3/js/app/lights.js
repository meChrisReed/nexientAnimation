define(['app/globals'], function (g) {
  return function createLights () {
    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    g.scene.add( light );
  };
});
