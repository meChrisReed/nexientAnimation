define(function () {
  window.test = {};

  var mouseX = 0, mouseY = 0,

  windowHalfX = window.innerWidth / 2,
  windowHalfY = window.innerHeight / 2,

  SEPARATION = 200,
  AMOUNTX = 10,
  AMOUNTY = 10,

  camera, scene, renderer;
  var scene,
      camera,
      renderer,

      clock = new THREE.Clock(),

      // test specific
      complexGeometry,
      particles,
      particleSystem;

    // utils
    function deg2rad (degrees) {
      return degrees * Math.PI / 180;
    }

    (function createScene (config) {
      var container, separation = 100, amountX = 50, amountY = 50,
      particles, particle;

      container = document.createElement('div');
      document.body.appendChild(container);

      camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
      camera.position.z = 200;

      scene = new THREE.Scene();

      renderer = new THREE.CanvasRenderer();
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );
      renderer.setClearColor( 0xffffff, 1);
      container.appendChild( renderer.domElement );
    }());

    (function setLights () {
      var light = new THREE.AmbientLight( 0x404040 ); // soft white light
      scene.add( light );

      var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );

      window.test.directionalLight = directionalLight;

      directionalLight.position.set( 0.5, 0.5, 0.5 );
      scene.add( directionalLight );
    }());

    function createParticle (maxPArticles, upperDistance, lowwerDistance) {
      maxPArticles = maxPArticles || 800;
      // from the center of the scene
      upperDistance = upperDistance || window.innerWidth/4;
      lowwerDistance = lowwerDistance || 5;
      var showEnds = Math.round(Math.random()) % 2 ? upperDistance : -upperDistance;

      function distribute () {
        var invert = Math.round(Math.random()) % 2 ? -1 : 1;
        return Math.round(Math.random() * upperDistance * invert + lowwerDistance);
      }

      var color = new THREE.Color().setHSL(0.039,1,0.5);
      function drawRightTri (context) {
        var cx = 1,
        cy = cx,
        side = cx,
        h = side * (Math.sqrt(3)/2);

        context.beginPath();

        context.lineTo( -side / 2, h / 2);
        context.lineTo( -side / 2, -h / 2);
        context.lineTo(h / 2, 0);

        context.fill();
      }
      function drawLeftTri (context) {
        var cx = 1,
        cy = cx,
        side = cx,
        h = side * (Math.sqrt(3)/2);

        context.beginPath();

        context.lineTo( side / 2, h / 2);
        context.lineTo( side / 2, -h / 2);
        context.lineTo(-h / 2, 0);

        context.fill();
      }
      var drawTri = function (context) {

        Math.round(Math.random()) % 2 ? drawRightTri : drawLeftTri;

        // circle
        // context.beginPath();
        // context.arc( 0, 0, 0.5, 0,  Math.PI * 2, true );
        // context.fill();
      };
      var particle = new THREE.Sprite(new THREE.SpriteCanvasMaterial( { color: color, program: Math.round(Math.random()) % 2 ? drawRightTri : drawLeftTri} ));
      // TODO need to add file from https://github.com/mrdoob/three.js/blob/master/examples/js/renderers/CanvasRenderer.js
      // var particle = new THREE.Sprite(new THREE.SpriteMaterial( { color: color} ));
      particle.position.set(
        distribute(),  // x
        0, // y
        0 // z
      );
      var scale = Math.random() * 30 + 5;
      particle.originalScale = scale;
      particle.scale.set(
        scale,  // x
        scale, // y
        scale // z
      );
      scene.add(particle);
      particles.push(particle);

      if (particles.length < maxPArticles) {
        return createParticle();
      }
    }

    (function initializeParticles () {
      particles = [];
      createParticle();
    }());

    (function render() {
      requestAnimationFrame( render );
      (function moveUp () {
        function flux (val, force) {
          var invert;
          val = val || 1;
          force = force || 1;

          // reduce the inversion value if the flux polarity is different from the initial vactor

          invert = Math.round(Math.random()) % 2 ? -val : 1;
          return Math.round(Math.random() * force * invert);
        }
        particles.forEach(function (particle) {
          if (!particle.initialVector) {
            particle.initialVector = {
              x: flux(),
              y: flux(),
              z: flux()
            };
          }
          if (
            particle.noiseDestination &&
            particle.noiseDuration > particle.startNoiseTransitionTime.getElapsedTime() * 10000
          ) {
            (function () {
              // get the amount to move based on the amount of time that has passed
              var elapsedTime = particle.startNoiseTransitionTime.getElapsedTime() * 10000;
              var movement;

              if (particle.lifeDuration < particle.life.getElapsedTime()) {
                scene.remove(particle);
                particles.splice(particles.indexOf(particle), 1);
                return createParticle();
              }
              var ratio = (particle.life.getElapsedTime() / particle.lifeDuration);
              var lifeRemainaing = 1 - ratio;
              particle.material.opacity = lifeRemainaing;
              var updatedScale = ((particle.originalScale) * (lifeRemainaing));
              particle.scale.set(updatedScale, updatedScale,  updatedScale);
              movement = elapsedTime/particle.noiseDuration;

              particle.position.x += (particle.noiseDestination.x - particle.position.x) * movement;
              particle.position.y += (particle.noiseDestination.y - particle.position.y) * movement;
              particle.position.z += (particle.noiseDestination.z - particle.position.z) * movement;
            }());
          } else {
            (function setNewNoiseDestination () {
              function matchPolarity (a, b) {
                if (
                  (a >= 0 && b >= 0) ||
                  (a < 0 && b < 0)
                ) {
                  return true;
                }
              }

              function flux (inversionDampening, force) {
                var fluxValues = {};

                Object.keys(inversionDampening).forEach(function (axis) {
                  var baseFlux = Math.round(Math.random() * force),
                    invert = baseFlux % 2 ? -1 : 1;

                  // compare baseFlux * invert with initialVector
                  if (!matchPolarity(baseFlux * invert, particle.initialVector[axis])) {
                    invert *= inversionDampening[axis];
                  }
                  fluxValues[axis] = baseFlux * invert;
                });
                return fluxValues;
              }

              var noiseValues = flux({
                x: 0.9,
                y: 0.3,
                z: 0.3
              }, Math.random() * 10 + 5);

              particle.noiseDestination = {
                x: particle.position.x + noiseValues.x,
                y: particle.position.y + noiseValues.y,
                z: particle.position.z + noiseValues.z
              };
              particle.startNoiseTransitionTime = new THREE.Clock();
              particle.startNoiseTransitionTime.start();
              particle.noiseDuration = Math.round(Math.random() * 4000) + 200; // in miliseconds
            }());
            if (!particle.life) {
              particle.life =  new THREE.Clock();
              particle.life.start();

              particle.lifeDuration = (Math.random() * 3) + 1; // in mils
            }
          }
        });
      }());
      renderer.render( scene, camera );
    }());
});