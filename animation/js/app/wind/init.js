define(['app/globals'], function (g) {
  var params,
    defaultParams = {
      rotation: {
        x: undefined,
        y: undefined,
        z: undefined
      }
    };
  return function (p) {
    params = params || Object.assign(defaultParams, p);
    // reset the cone
    g.windObject.position.set(0,0,0);

    g.windObject.rotateX(params.rotation.x || Math.random() * 360);
    g.windObject.rotateY(params.rotation.y || Math.random() * 360);
    g.windObject.rotateZ(params.rotation.z || Math.random() * 360);

    // move the cylinder off of the particles
    g.windObject.translateY(g.windObject.geometry.parameters.height*2);
  };
});
