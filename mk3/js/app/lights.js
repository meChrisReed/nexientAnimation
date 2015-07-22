define(function () {
  return function createLights (g) {
    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    g.scene.add( light );

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.position.set( 0.5, 0.5, 0.5 );
    g.scene.add( directionalLight );
  };
});
