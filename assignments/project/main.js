var pitch;
var boxShape, hitBox, world, physicsMaterial, camera, scene, renderer, geometry, material, mesh, heli, stats, buildingGroup;
var walls=[], balls=[], ballMeshes=[], boxes=[], boxMeshes=[], mixers = [], key = [];
var boxMesh, heliSound;
//variables
var width = window.innerWidth;
var height = window.innerHeight;
var hitBoxTemp = new THREE.Vector3(0,0,2);
var dt = 1/60;
var ballShape = new CANNON.Sphere(0.1);
var ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32);
var shootDirection = new THREE.Vector3();
var shootVelo = 50;
var projector = new THREE.Projector();		
var mousedownID = -1;
var timer = new THREE.Clock();

var firstMouseMove  = true;

var raycaster = new THREE.Raycaster(),targeted;
var mouse = new THREE.Vector2();
var camPos = {x: 0, y: 0, z: -1};
var oldMousePos = {x: 0, y: 0};
var camMove = new THREE.Vector3(0, 0, 0);
var camStrafe = new THREE.Vector3(0, 0, 0);
var cameraLookAt = new THREE.Vector3(0, 0, -0.1);
var cameraRight = new THREE.Vector3(0.2, 0, 0);
var streetLookAt = new THREE.Vector3(0, 0.1, 0);
var cameraFloat = new THREE.Vector3(0, 0.1, 0);
var cameraUp = new THREE.Vector3().crossVectors(cameraRight, cameraLookAt);
var loaded = false;



//event listener 
document.addEventListener('mousemove', handleMouseMove, false);
document.body.addEventListener("keydown", function (k) {
	key[k.keyCode] = true;
});
document.body.addEventListener("keyup", function (k) {
	key[k.keyCode] = false;
});
window.addEventListener("mouseup",function(e){
	if(mousedownID!=-1) {  //Only stop if exists
		clearInterval(mousedownID);
		mousedownID=-1;
	}
});
window.addEventListener("mousedown",function(e){
	if(mousedownID==-1)  //Prevent multimple loops!
		mousedownID = setInterval(whilemousedown, 200 /*execute every 100ms*/);
});

function initCannon(){
// Setup our world
    world = new CANNON.World();
    var solver = new CANNON.GSSolver();

    world.defaultContactMaterial.contactEquationStiffness = 1e9;
    world.defaultContactMaterial.contactEquationRelaxation = 40;

    solver.iterations = 7;
    solver.tolerance = 0.1;
    var split = true;
    if(split)
		world.solver = new CANNON.SplitSolver(solver);
    else
		world.solver = solver;

	world.gravity.set(0,-20,0);
	world.broadphase = new CANNON.NaiveBroadphase();

	// Create a slippery material (friction coefficient = 0.0)
    physicsMaterial = new CANNON.Material("slipperyMaterial");
    var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial, physicsMaterial,0.0, 0.3);
    //add the contact materials to the world
    world.addContactMaterial(physicsContactMaterial);

	// Create model hitbox
	var mass = 0;
	var halfExtents = new CANNON.Vec3(1,1,1);
	boxShape = new CANNON.Box(halfExtents);
	var boxGeometry = new THREE.BoxGeometry(halfExtents.x,halfExtents.y,halfExtents.z);
	hitBox = new CANNON.Body({mass});
	hitBox.addShape(boxShape);
	//hitBox.position.set(0,1,2);
	hitBox.position.x = hitBoxTemp.x;
	hitBox.position.y = hitBoxTemp.y;
	hitBox.position.z = hitBoxTemp.z;
	
	world.addBody(hitBox);
	
	/*
	//Hit box debugging
	boxMesh = new THREE.Mesh( boxGeometry, material );
	boxMesh.position.x = hitBox.position.x;
	boxMesh.position.y = hitBox.position.y;
	boxMesh.position.z = hitBox.position.z;
	
	//////////////////////// */
	
	// Create a plane
	var groundShape = new CANNON.Plane();
	var groundBody = new CANNON.Body({ mass: 0 });
	groundBody.addShape(groundShape);
	groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
	world.addBody(groundBody);
}

function init() {
//renderer
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setClearColor(0x63ddff);
document.body.appendChild(renderer.domElement);
buildingGroup = new THREE.Group();
// create scene object
scene = new THREE.Scene();
//scene.add(boxMesh);


// add lighting and add to scene
var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10.0, 5.0, 30.0).normalize();
scene.add(directionalLight);
var ambientLight = new THREE.AmbientLight(0x202020);
scene.add(ambientLight);

// create perspective camera
camera = new THREE.PerspectiveCamera(90, width / height, 0.1, 25);
camera.position.x = 0.0;
camera.position.y = 1.0;
camera.position.z = 4.0;
// add to scene and renderer
scene.add(camera); 

makeGround();
makeStreets();
makeBuildings();
loadModel();
makeStats();
playSounds();



	
}

function makeStats(){
	//stats display
	stats = new Stats();
	stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
	document.body.appendChild( stats.dom );
}

function playSounds(){
	var listener = new THREE.AudioListener();
	camera.add( listener );

	// create a global audio source
	var sound = new THREE.Audio( listener );

	// load a sound and set it as the Audio object's buffer
	var audioLoader = new THREE.AudioLoader();
	audioLoader.load( './music/background.mp3', function( buffer ) {
		sound.setBuffer( buffer );
		sound.setLoop( true );
		sound.setVolume( 0.25 );
		sound.play();
	});
	
	var material = new THREE.MeshPhongMaterial( { color: 0xffaa00, flatShading: true, shininess: 0 } );
	heliSound = new THREE.Mesh( new THREE.SphereBufferGeometry( 0.01, 0.01, 0.01 ), material );
				heliSound.position.x = hitBox.position.x;
				heliSound.position.y = hitBox.position.y;
				heliSound.position.z = hitBox.position.z;
				scene.add( heliSound );
	var heliRotor = new THREE.PositionalAudio( listener );
		audioLoader.load( './music/copter_sound.mp3', function ( buffer ) {
		heliRotor.setBuffer( buffer );
		heliRotor.setLoop( true );
		heliRotor.setRefDistance( 20 );
		heliRotor.setVolume( 0.15 );
		heliRotor.play();
	});
	heliSound.add(heliRotor);

}

function makeBuildings(){
	//position boxes in a city like environment
	//Coordinates for 200 buildings, and the for loop that creates them
	var buildingXs = [  
		-90.0, -90.0, -90.0, -90.0, -90.0, -90.0, -90.0, -90.0, -90.0, -90.0, 
		-85.0, -85.0, -85.0, -85.0, -85.0, -85.0, -85.0, -85.0, -85.0, -85.0,	
		-70.0, -70.0, -70.0, -70.0, -70.0, -70.0, -70.0, -70.0, -70.0, -70.0, 
		-65.0, -65.0, -65.0, -65.0, -65.0, -65.0, -65.0, -65.0, -65.0, -65.0,	
		-50.0, -50.0, -50.0, -50.0, -50.0, -50.0, -50.0, -50.0, -50.0, -50.0, 
		-45.0, -45.0, -45.0, -45.0, -45.0, -45.0, -45.0, -45.0, -45.0, -45.0,	
		-30.0, -30.0, -30.0, -30.0, -30.0, -30.0, -30.0, -30.0, -30.0, -30.0, 
		-25.0, -25.0, -25.0, -25.0, -25.0, -25.0, -25.0, -25.0, -25.0, -25.0,	
		-10.0, -10.0, -10.0, -10.0, -10.0, -10.0, -10.0, -10.0, -10.0, -10.0, 
		-5.0, -5.0, -5.0, -5.0, -5.0, -5.0, -5.0, -5.0, -5.0, -5.0,	
		10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0,
		15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0,	
		30.0, 30.0, 30.0, 30.0, 30.0, 30.0, 30.0, 30.0, 30.0, 30.0,
		35.0, 35.0, 35.0, 35.0, 35.0, 35.0, 35.0, 35.0, 35.0, 35.0,	
		50.0, 50.0, 50.0, 50.0, 50.0, 50.0, 50.0, 50.0, 50.0, 50.0, 
		55.0, 55.0, 55.0, 55.0, 55.0, 55.0, 55.0, 55.0, 55.0, 55.0,	
		70.0, 70.0, 70.0, 70.0, 70.0, 70.0, 70.0, 70.0, 70.0, 70.0, 
		75.0, 75.0, 75.0, 75.0, 75.0, 75.0, 75.0, 75.0, 75.0, 75.0,	
		90.0, 90.0, 90.0, 90.0, 90.0, 90.0, 90.0, 90.0, 90.0, 90.0, 
		95.0, 95.0, 95.0, 95.0, 95.0, 95.0, 95.0, 95.0, 95.0, 95.0							
		];
	var buildingZs = [  
		-90.0, -85.0, -70.0, -65.0, -50.0, -45.0, -30.0, -25.0, -10.0, -5.0, 
		-90.0, -85.0, -70.0, -65.0, -50.0, -45.0, -30.0, -25.0, -10.0, -5.0,	
		-90.0, -85.0, -70.0, -65.0, -50.0, -45.0, -30.0, -25.0, -10.0, -5.0, 
		-90.0, -85.0, -70.0, -65.0, -50.0, -45.0, -30.0, -25.0, -10.0, -5.0,
		-90.0, -85.0, -70.0, -65.0, -50.0, -45.0, -30.0, -25.0, -10.0, -5.0, 	
		-90.0, -85.0, -70.0, -65.0, -50.0, -45.0, -30.0, -25.0, -10.0, -5.0,
		-90.0, -85.0, -70.0, -65.0, -50.0, -45.0, -30.0, -25.0, -10.0, -5.0, 
		-90.0, -85.0, -70.0, -65.0, -50.0, -45.0, -30.0, -25.0, -10.0, -5.0,
		-90.0, -85.0, -70.0, -65.0, -50.0, -45.0, -30.0, -25.0, -10.0, -5.0, 
		-90.0, -85.0, -70.0, -65.0, -50.0, -45.0, -30.0, -25.0, -10.0, -5.0,
		-90.0, -85.0, -70.0, -65.0, -50.0, -45.0, -30.0, -25.0, -10.0, -5.0, 
		-90.0, -85.0, -70.0, -65.0, -50.0, -45.0, -30.0, -25.0, -10.0, -5.0,
		-90.0, -85.0, -70.0, -65.0, -50.0, -45.0, -30.0, -25.0, -10.0, -5.0, 
		-90.0, -85.0, -70.0, -65.0, -50.0, -45.0, -30.0, -25.0, -10.0, -5.0,
		-90.0, -85.0, -70.0, -65.0, -50.0, -45.0, -30.0, -25.0, -10.0, -5.0, 	
		-90.0, -85.0, -70.0, -65.0, -50.0, -45.0, -30.0, -25.0, -10.0, -5.0,
		-90.0, -85.0, -70.0, -65.0, -50.0, -45.0, -30.0, -25.0, -10.0, -5.0, 
		-90.0, -85.0, -70.0, -65.0, -50.0, -45.0, -30.0, -25.0, -10.0, -5.0,
		-90.0, -85.0, -70.0, -65.0, -50.0, -45.0, -30.0, -25.0, -10.0, -5.0, 
		-90.0, -85.0, -70.0, -65.0, -50.0, -45.0, -30.0, -25.0, -10.0, -5.0
		];
	for(var i = 0; i < 200; i+=4){	
		var b1 = makeBuildingsHelper("images/bldg3.jpg" ,2.5, 6.0,2.5, buildingXs[i], 3.0,buildingZs[i] );
		var b2 = makeBuildingsHelper("images/bldg4.jpg" ,2.5, 8.0,2.5, buildingXs[i+1], 4.0,buildingZs[i+1] );
		var b3 = makeBuildingsHelper("images/bldg2.jpg" ,2.5, 10.0,2.5, buildingXs[i+2], 5.0,buildingZs[i+2] );
		var b4 = makeBuildingsHelper("images/bldg1.jpg" ,2.5, 14.0,2.5, buildingXs[i+3], 7.0, buildingZs[i+3] );

	} 
	//adds all buildings in buildingGroup to scene
	scene.add(buildingGroup);
}

function makeGround(){
	//create ground
	var groundGeometry = new THREE.PlaneGeometry(512, 256,  4, 4);
	groundGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
	var groundMaterial1 = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('images/grass_texture.jpg')});
		groundMaterial1.map.wrapS = groundMaterial1.map.wrapT = THREE.RepeatWrapping;
		groundMaterial1.map.repeat.set( 2, 2 );

	var ground = new THREE.Mesh(groundGeometry, groundMaterial1);
	ground.receiveShadow = true;
	ground.position.y = 0;
	ground.position.z = -5.0;
	scene.add(ground);
}

function render() {
	movement();
	rotorSpin();
	caster();
	stats.update();
	camera.position.add(camMove);
	camera.position.add(camStrafe);
	var newLookAt = new THREE.Vector3().addVectors(camera.position, cameraLookAt);
	camera.lookAt(newLookAt);
	camera.up = cameraUp;
	
    world.step(dt);
    // Update ball positions
    for(var i=0; i<balls.length; i++){
        ballMeshes[i].position.copy(balls[i].position);
        ballMeshes[i].quaternion.copy(balls[i].quaternion);
    }
    // Update box positions
    for(var i=0; i<boxes.length; i++){
        boxMeshes[i].position.copy(boxes[i].position);
        boxMeshes[i].quaternion.copy(boxes[i].quaternion);
    }
    renderer.render( scene, camera );
   
    
	renderer.render( scene, camera); // render the scene
	requestAnimationFrame( render );	
}

function rotorSpin() {
    if (mixers.length > 0){
		for (var i = 0; i < mixers.length; i++) {
			mixers[i].update(timer.getDelta());
		}
    }
}

function caster(){
	raycaster.setFromCamera(mouse, camera);
	var targeting = raycaster.intersectObjects(buildingGroup.children);
	if (targeting.length > 0) {
        if (targeted != targeting[0].object) {
            if (targeted){
				targeted.material.emissive.setHex(targeted.currentHex);
			}
            targeted = targeting[0].object;
            targeted.currentHex = targeted.material.emissive.getHex();
            //setting up new material on hover
            targeted.material.emissive.setHex(0x404040);
        }
    } else {
        if (targeted){
		targeted.material.emissive.setHex(targeted.currentHex);
		}
        targeted = null;	  
    }
}

function loadModel(){
	//load model
	var loader = new THREE.FBXLoader();
	loader.load('./model/MD502.txt',  function (object) {
	//	object.TGALoader();
	object.scale.set( 0.1, 0.1, 0.1 )
	object.position.x = camera.position.x;
	object.position.y = camera.position.y-1.0;					   
	object.position.z = camera.position.z-2.0;
	object.rotation.y = Math.PI;
	heli = object;

	mixer = new THREE.AnimationMixer(object);
	mixers.push(mixer);
	mixer.clipAction(object.animations[0]).play();
	scene.add(object);
	loaded = true;
	
});
}
	
function movement() {
	//A
    if (key[65]) {   
		camera.position.sub(cameraRight);
		hitBoxTemp.sub(cameraRight);
		movementHelper(hitBoxTemp);
    }
	//D
    if (key[68]) {
		camera.position.add(cameraRight);
		hitBoxTemp.add(cameraRight);
		movementHelper(hitBoxTemp);
	}
	//W
	if (key[83]) {
		camera.position.sub(cameraLookAt);
		hitBoxTemp.sub(cameraLookAt);
		movementHelper(hitBoxTemp);
	}
	//S
	if (key[87]) {
		camera.position.add(cameraLookAt);
		hitBoxTemp.add(cameraLookAt);
		movementHelper(hitBoxTemp);
	}
	//SPACEBAR
	if (key[32]) {
		camera.position.add(cameraFloat);
		hitBoxTemp.add(cameraFloat);
		movementHelper(hitBoxTemp);
		
	}
	//SHIFT
	if (key[16]) {
		if(hitBoxTemp.y > 0.5){ 
			camera.position.sub(cameraFloat);
			hitBoxTemp.sub(cameraFloat);
			movementHelper(hitBoxTemp);
		}
	}
	
}

function makeStreets(){
	
////////////////////////////////////////////Streets//////////////////////////////////
//straight streets 
var street2Geometry = new THREE.PlaneGeometry(4.0, 104.0);
var streetMaterial = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('images/street.jpg')});
	streetMaterial.map.wrapS = streetMaterial.map.wrapT = THREE.RepeatWrapping;
	streetMaterial.map.repeat.set( 4, 4 );

var street =  new THREE.Mesh(street2Geometry, streetMaterial);
street.lookAt(streetLookAt);
street.position.y = .02;
street.position.x=2.5;
street.position.z=-47.5;
scene.add(street);
var x=2.5;
for(var i=0; i<6; i++){
	var streetS = new THREE.Mesh(street2Geometry, streetMaterial);
	streetS.lookAt(streetLookAt);
	streetS.position.y = .02;
	streetS.position.x=x;
	streetS.position.z=-47.5
	scene.add(streetS);
	x+=20.0;
}
x=-17.5;
for(var i=0; i<4; i++){
	var streetS = new THREE.Mesh(street2Geometry, streetMaterial);
	streetS.lookAt(streetLookAt);
	streetS.position.y = .02;
	streetS.position.x=x;
	streetS.position.z=-47.5;
	scene.add(streetS);
	x-=20.0;
}
var street2 = new THREE.Mesh(street2Geometry, streetMaterial);
street2.lookAt(streetLookAt);
street2.position.y = .02;
street2.position.x=-102.5;
street2.position.z=-47.5;
scene.add(street2);


/////////////////////////////////////diagonal streets//////////////////////////////
var streetGeometry = new THREE.PlaneGeometry(205.0, 4.0);
var street3 = new THREE.Mesh(streetGeometry, streetMaterial);
street3.lookAt(streetLookAt);
street3.position.y = .02;
street3.position.x=0;
street3.position.z=2.5;
scene.add(street3);

var z= -17.5;
for(var i=0; i< 5; i++){
var streetD = new THREE.Mesh(streetGeometry, streetMaterial);
streetD.lookAt(streetLookAt);
streetD.position.y = .02;
streetD.position.x=0;
streetD.position.z=z;
scene.add(streetD);
z-=20.0;
}

/////////////////////////////////////////////////////////////////End of Streets//////////////////////////////////////////////////
///////////////////////////////////////////////////////////////// Road Lines/////////////////////////////////////////////////////
var rLMaterial = new THREE.LineDashedMaterial( {
	color: 0xffffff,
	linewidth: 0.1,
	scale: 0.1,
	dashSize: 0.3,
	gapSize: 0.1,
} );
var z= -95.0;
for(var i=0; i<97; i++){
	if((z<-17.5-2.0 || z>-17.5+2.0) && (z<-37.5-2.0 || z>-37.5+2.0) && (z<-57.5-2.0 || z>-57.5+2.0) && (z<-77.5-2.0 || z>-77.5+2.0)){
		var rLGeometry = new THREE.PlaneGeometry(0.5, 0.2);
		//roadLine
		var roadLine = new THREE.Mesh(rLGeometry, rLMaterial);
		roadLine.lookAt(streetLookAt);
		roadLine.position.y = .03;
		roadLine.position.x=2.5;
		roadLine.position.z= z;
		scene.add(roadLine);
		//roadLine2
		var roadLine2 = new THREE.Mesh(rLGeometry, rLMaterial);
		roadLine2.lookAt(streetLookAt);
		roadLine2.position.y = .03;
		roadLine2.position.x=-17.5;
		roadLine2.position.z=z;
		scene.add(roadLine2);
		//roadLine3
		var roadLine3 = new THREE.Mesh(rLGeometry, rLMaterial);
		roadLine3.lookAt(streetLookAt);
		roadLine3.position.y = .03;
		roadLine3.position.x=-37.5;
		roadLine3.position.z=z;
		scene.add(roadLine3);
		//roadLine4
		var roadLine4 = new THREE.Mesh(rLGeometry, rLMaterial);
		roadLine4.lookAt(streetLookAt);
		roadLine4.position.y = .03;
		roadLine4.position.x=-57.5;
		roadLine4.position.z=z;
		scene.add(roadLine4);
		//roadLine5
		var roadLine5 = new THREE.Mesh(rLGeometry, rLMaterial);
		roadLine5.lookAt(streetLookAt);
		roadLine5.position.y = .03
		roadLine5.position.x=-77.5;
		roadLine5.position.z=z;
		scene.add(roadLine5);
		//roadLine6
		var roadLine6 = new THREE.Mesh(rLGeometry, rLMaterial);
		roadLine6.lookAt(streetLookAt);
		roadLine6.position.y = .03;
		roadLine6.position.x=-102.5;
		roadLine6.position.z=z;
		scene.add(roadLine6);
		//roadline7
		var roadLine7 = new THREE.Mesh(rLGeometry, rLMaterial);
		roadLine7.lookAt(streetLookAt);
		roadLine7.position.y = .03;
		roadLine7.position.x=22.5;
		roadLine7.position.z=z;
		scene.add(roadLine7);
		//roadline8
		var roadLine8 = new THREE.Mesh(rLGeometry, rLMaterial);
		roadLine8.lookAt(streetLookAt);
		roadLine8.position.y = .03;
		roadLine8.position.x=42.5;
		roadLine8.position.z=z;
		scene.add(roadLine8);
		//roadline9
		var roadLine9 = new THREE.Mesh(rLGeometry, rLMaterial);
		roadLine9.lookAt(streetLookAt);
		roadLine9.position.y = .03;
		roadLine9.position.x=62.5;
		roadLine9.position.z=z;
		scene.add(roadLine9);
		
		//roadline10
		var roadLine10 = new THREE.Mesh(rLGeometry, rLMaterial);
		roadLine10.lookAt(streetLookAt);
		roadLine10.position.y = .03;
		roadLine10.position.x=82.5;
		roadLine10.position.z= z
		scene.add(roadLine10);
		//roadline11
		var roadLine11 = new THREE.Mesh(rLGeometry, rLMaterial);
		roadLine11.lookAt(streetLookAt);
		roadLine11.position.y = .03;
		roadLine11.position.x=102.5;
		roadLine11.position.z=z;
		scene.add(roadLine11);
	}
	z+=1.0;
}
//diagonal roadlines//////////////////
var x= -10.0;
for(var i=0; i<20.0; i++){
	if((x<-17.5-2.0 || x>-17.5+2.0) &&(x<2.5-2.0 || x>2.5+2.0)&& (x<-37.5-2.0 || x>-37.5+2.0) && (x<-57.5-2.0 || x>-57.5+2.0) && (x<-77.5-2.0 || x>-77.5+2.0) && (x<22.5-2.0 || x>22.5+2.0) && (x<42.5-2.0 || x>42.5+2.0)&& (x<62.5-2.0 || x>62.5+2.0) && (x<82.5-2.0 || x>82.5+2.0)&& (x<102.5-2.0 || x>102.5+2.0)){
	var rL2Geometry = new THREE.PlaneGeometry(0.2, 0.5);
	//roadline17
	var roadLine17 = new THREE.Mesh(rL2Geometry, rLMaterial);
	roadLine17.lookAt(streetLookAt);
	roadLine17.position.y = .04;
	roadLine17.position.x= x;
	roadLine17.position.z=2.5;
	scene.add(roadLine17);	
	//roadline12
	var roadLine12 = new THREE.Mesh(rL2Geometry, rLMaterial);
	roadLine12.lookAt(streetLookAt);
	roadLine12.position.y = .03;
	roadLine12.position.x=x;
	roadLine12.position.z=-17.5;
	scene.add(roadLine12);
	//roadline13
	var roadLine13 = new THREE.Mesh(rL2Geometry, rLMaterial);
	roadLine13.lookAt(streetLookAt);
	roadLine13.position.y = .03;
	roadLine13.position.x=x;
	roadLine13.position.z=-37.5;
	scene.add(roadLine13);
	//roadline14
	var roadLine14 = new THREE.Mesh(rL2Geometry, rLMaterial);
	roadLine14.lookAt(streetLookAt);
	roadLine14.position.y = .03;
	roadLine14.position.x=x;
	roadLine14.position.z=-57.5;
	scene.add(roadLine14);
	//roadline15
	var roadLine15 = new THREE.Mesh(rL2Geometry, rLMaterial);
	roadLine15.lookAt(streetLookAt);
	roadLine15.position.y = .03;
	roadLine15.position.x=x;
	roadLine15.position.z=-77.5;
	scene.add(roadLine15);
	//roadline16
	var roadLine16 = new THREE.Mesh(rL2Geometry, rLMaterial);
	roadLine16.lookAt(streetLookAt);
	roadLine16.position.y = .03;
	roadLine16.position.x=x;
	roadLine16.position.z=-97.5;
	scene.add(roadLine16);
	}
	x+=1.0
}

}

function movementHelper(object){
	hitBox.position.x = object.x;
	hitBox.position.y = object.y;
	hitBox.position.z = object.z;
	heli.position.x = hitBox.position.x;
	heli.position.y = hitBox.position.y;
	heli.position.z = hitBox.position.z;
	heliSound.position.x = hitBox.position.x;
	heliSound.position.y = hitBox.position.y+.05;
	heliSound.position.z = hitBox.position.z;
	//HitboxMeshDebug
	/*
	boxMesh.position.x = hitBox.position.x;
	boxMesh.position.y = hitBox.position.y+.5;
	boxMesh.position.z = hitBox.position.z;
	*/
	
	
}

function handleMouseMove(event) {
	if(firstMouseMove) {
		oldMousePos.x = event.clientX;
		oldMousePos.y = event.clientY;
		firstMouseMove = false;
		return;
	}

	var yaw = (oldMousePos.x - event.clientX) / 2000.0;
	pitch = (oldMousePos.y - event.clientY) / 2000.0;
	
	
	
	heli.rotation.y += yaw;
	heli.rotation.x += pitch;
	
	cameraLookAt.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
	cameraRight.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
	
	cameraLookAt.applyAxisAngle(cameraRight, pitch);
	
	
	oldMousePos.x = event.clientX;
	oldMousePos.y = event.clientY;
	
	//raycaster 
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;	  
}

function makeBuildingsHelper(image,width,height,depth, positionX, positionY,positionZ) {
	material = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(image)});
	var halfExtents = new CANNON.Vec3(width-1,height-1,depth-1);
    var boxShape = new CANNON.Box(halfExtents);
    var boxGeometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);
    var buildingBody = new CANNON.Body({ mass: 1 });
    buildingBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh( boxGeometry, material );
    world.addBody(buildingBody);
    scene.add(boxMesh);
    buildingBody.position.set(positionX,positionY,positionZ);
    boxMesh.position.set(positionX,positionY,positionZ);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
	buildingGroup.add(boxMesh);
    boxes.push(buildingBody);
    boxMeshes.push(boxMesh);
}

function getShootDir(targetVec){
	var vector = targetVec;
	targetVec.set(mouse.x,mouse.y,1);
	vector.unproject(camera);
	var ray = new THREE.Ray(hitBox.position, vector.sub(hitBox.position).normalize() );
	targetVec.copy(ray.direction);
}

function whilemousedown() {
	var x = hitBox.position.x;
	var y = hitBox.position.y;
	var z = hitBox.position.z;
	var ballBody = new CANNON.Body({ mass: 10 });
	ballBody.addShape(ballShape);
	material = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('images/lava.png')});
	var ballMesh = new THREE.Mesh( ballGeometry, material );
	world.addBody(ballBody);
	scene.add(ballMesh);
	ballMesh.castShadow = true;
	ballMesh.receiveShadow = true;
	balls.push(ballBody);
	ballMeshes.push(ballMesh);
	getShootDir(shootDirection);
	ballBody.velocity.set(shootDirection.x * shootVelo, shootDirection.y * shootVelo, shootDirection.z * shootVelo);

	// Move the ball outside the player sphere
	x += shootDirection.x * (1 + ballShape.radius);
	y += shootDirection.y * (1 + ballShape.radius);
	z += shootDirection.z * (1 + ballShape.radius);
	ballBody.position.set(x,y,z);
	ballMesh.position.set(x,y,z);
}



initCannon();
init();
render();



