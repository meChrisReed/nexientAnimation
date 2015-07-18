window.test = {};

$(document).ready(function () {
	var scene,
		camera,
		renderer,

		clock = new THREE.Clock(),

		// test specific
		complexGeometry,
		particles;

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
		renderer.setClearColor( 0xffffff, 1);
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

	function createParticle (maxPArticles, upperDistance, lowwerDistance) {
		maxPArticles = maxPArticles || 1000;
		// from the center of the scene
		upperDistance = upperDistance || 800;
		lowwerDistance = lowwerDistance || 5;
		var showEnds = Math.round(Math.random()) % 2 ? upperDistance : -upperDistance;

		function distribute () {
			var invert = Math.round(Math.random()) % 2 ? -1 : 1;
			return Math.round(Math.random() * upperDistance * invert + lowwerDistance);
		}

		var color = new THREE.Color().setHSL(0.039,1,0.5);
		var particle = new THREE.Sprite(new THREE.SpriteMaterial( { color: color, size: 15} ));
		particle.position.set(
			distribute(),  // x
			0, // y
			0 // z
		);
		var scale = Math.random() * 30;
		particle.scale.set(
			scale,  // x
			scale, // y
			scale // z
		);
		scene.add(particle);
		particles.vertices.push(particle);

		if (particles.vertices.length < maxPArticles) {
			return createParticle();
		}
	}

	(function initializeParticles () {

		particles = new THREE.Geometry();

  	createParticle();

		// scene.add(particles);
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
	    particles.vertices.forEach(function (particle) {
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
							particles.vertices.splice(particles.vertices.indexOf(particle), 1);
							return createParticle();
						}
						particle.material.opacity = 1 -(particle.life.getElapsedTime() / particle.lifeDuration);
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
						}, Math.random() * 30 + 5);

						particle.noiseDestination = {
							x: particle.position.x + noiseValues.x,
							y: particle.position.y + noiseValues.y,
							z: particle.position.z + noiseValues.z
						};
						particle.startNoiseTransitionTime = new THREE.Clock();
						particle.startNoiseTransitionTime.start();
						particle.noiseDuration = Math.round(Math.random() * 2300) + 100; // in miliseconds
					}());
					if (!particle.life) {
						particle.life =  new THREE.Clock();
						particle.life.start();

						particle.lifeDuration = (Math.random() * 3) + 0.6; // in mils
					}
				}
			});
			// particles.verticesNeedUpdate = true;
		}());
		renderer.render( scene, camera );
	}());
});
