window.test = {};

$(document).ready(function () {
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
		var baseConfig = {
			height: $(document).width(),
			width: $(document).height()
		};

		config = $.extend(baseConfig, config || {});

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		camera.position.z = 500;

		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );
	}());

	(function setLights () {
		var light = new THREE.AmbientLight( 0x404040 ); // soft white light
		scene.add( light );

		var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );

		window.test.directionalLight = directionalLight;

		directionalLight.position.set( 0.5, 0.5, 0.5 );
		scene.add( directionalLight );
	}());

	(function initializeParticles () {
		var maxPArticles = 150,
			// from the center of the scene
			upperDistance = 500,
			lowwerDistance = 5,

			particleMaterial = new THREE.ParticleBasicMaterial({ color: 0xeeeeee, size: 15, transparent: true });

		particles = new THREE.Geometry();

  	(function createParticle () {
			var showEnds = Math.round(Math.random()) % 2 ? upperDistance : -upperDistance;

			function distribute () {
				var invert = Math.round(Math.random()) % 2 ? -1 : 1;
				return Math.round(Math.random() * upperDistance * invert + lowwerDistance);
			}

			var particle = new THREE.Vector3(
				distribute(),  // x
				0, // y
				0 // z
			);
			particles.vertices.push(particle);

			if (particles.vertices.length < maxPArticles) {
				return createParticle();
			}
		}());

		particleSystem = new THREE.ParticleSystem(particles, particleMaterial);
		scene.add(particleSystem);
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
	    particleSystem.geometry.vertices.forEach(function (particle) {
				if (!particle.initialVector) {
					particle.initialVector = {
						x: flux(),
						y: flux(),
						z: flux()
					};
				}
				if (
					particle.noiseDestination &&
					particle.noiseDuration > particle.startNoiseTransitionTime.getElapsedTime() * 1000
				) {
					(function () {
						// get the amount to move based on the amount of time that has passed
						var elapsedTime = particle.startNoiseTransitionTime.getElapsedTime() * 1000;
						var movement = elapsedTime/particle.noiseDuration;
						particle.x += (particle.noiseDestination.x - particle.x) * movement;
						particle.y += (particle.noiseDestination.y - particle.y) * movement;
						particle.z += (particle.noiseDestination.z - particle.z) * movement;
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
							y: 0.2,
							z: 0.2
						}, 40);

						particle.noiseDestination = {
							x: particle.x + noiseValues.x,
							y: particle.y + noiseValues.y,
							z: particle.z + noiseValues.z
						};
						particle.startNoiseTransitionTime = new THREE.Clock();
						particle.startNoiseTransitionTime.start();
						particle.noiseDuration = Math.round(Math.random() * 150); // in miliseconds
					}());
				}
			});
			particleSystem.geometry.verticesNeedUpdate = true;
		}());
		renderer.render( scene, camera );
	}());
});
