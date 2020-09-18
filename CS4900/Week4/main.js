//variable declaration section
let physicsWorld, scene, camera, clock, stats, sound, controls, renderer, rigidBodies = [], tmpTrans = null;
let player = null, flag = null, playerMoveDirection = { left: 0, right: 0, forward: 0, back: 0 };
let ammoTmpPos = null, ammoTmpQuat = null;
let playerGroup = 1, flagGroup = 2, buildingGroup = 3, ghostGroup = 4;
let a = false;
let b = false;
let flagCallBack = null;
let theMixer;// = new THREE.AnimationMixer();

let objects = [];
let canJump = false;
let prevTime = performance.now();
let direction = new THREE.Vector3();
let vertex = new THREE.Vector3();
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2(), intersected_Object;

let playing = false; //set to true for level creation
let level = 0;	//set to true for level creation


let level_Select_Objects = [];
let menu_Group;

//Ammojs Initialization
Ammo().then(start);

///////////////////////////////////////////////////////////////////////////////////////
//	INITIALIZATION
///////////////////////////////////////////////////////////////////////////////////////

function start (){
	tmpTrans = new Ammo.btTransform();
	ammoTmpPos = new Ammo.btVector3();
	ammoTmpQuat = new Ammo.btQuaternion();
	flagCallBack = new Ammo.ConcreteContactResultCallback();


	setupEventHandlers();
	showStats();
	load_Manager();	//comment out for level creation
}

///////////////////////////////////////////////////////////////////////////////////////
//	LOADERS
///////////////////////////////////////////////////////////////////////////////////////

function load_Manager() {	
	scene = new THREE.Scene();
	//scene.dispose();

	document.getElementById("blocker").style.display = "block";
	document.getElementById("load").style.display = "";
	document.getElementById("instructions").style.display = "";

	switch (level){
		case 0:
			create_Start_Menu();
			break;
		case 1:
			createLevel1();
			break;
		case 2:
			createLevel1();
			break;
		case 3:
			createLevel1();
			break;
		case 4:
			createLevel1();
			break;
		case 5:
			createLevel1();
			break;

	}
}

///////////////////////////////////////////////////////////////////////////////////////
//	SYSTEM
///////////////////////////////////////////////////////////////////////////////////////
function updatePhysics( deltaTime ){
	// Step world
	physicsWorld.stepSimulation( deltaTime, 10 );
	if(a && b){
		physicsWorld.contactPairTest(player.userData.physicsBody, flag.userData.physicsBody, flagCallBack );
	}

	// Update rigid bodies
	for ( let i = 0; i < rigidBodies.length; i++ ) {
		let objThree = rigidBodies[i];
		let objAmmo = objThree.userData.physicsBody;
		let ms = objAmmo.getMotionState();
		if ( ms ){
			ms.getWorldTransform( tmpTrans );
			let p = tmpTrans.getOrigin();
			let q = tmpTrans.getRotation();
			objThree.position.set( p.x(), p.y(), p.z() );
			objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() );
		}
	}
}

flagCallBack.addSingleResult = function () {
	console.log("COLLIDE");
	//level = 0;
	//load_Manager();
};

function movePlayer(){
	let scalingFactor = 20; //move speed

	let moveX =  playerMoveDirection.right - playerMoveDirection.left;
	let moveZ =  playerMoveDirection.back - playerMoveDirection.forward;
	let moveY =  0;

	let vertex = new THREE.Vector3(moveX,moveY,moveZ);
	vertex.applyQuaternion(camera.quaternion);

	if( moveX == 0 && moveY == 0 && moveZ == 0) return;

	let resultantImpulse = new Ammo.btVector3( vertex.x, 0, vertex.z );
	resultantImpulse.op_mul(scalingFactor);

	let physicsBody = player.userData.physicsBody;
	physicsBody.setLinearVelocity ( resultantImpulse );
}

function updateCamera(){
	camera.position.x = player.position.x;
	camera.position.y = player.position.y;
	camera.position.z = player.position.z;
}

function renderFrame(){
	let deltaTime = clock.getDelta();

	if (playing === true) {
		updatePhysics( deltaTime );
		stats.update();

		if ( controls.isLocked === true ) {
			raycaster.ray.origin.copy( controls.getObject().position );
			raycaster.ray.origin.y -= 10;
		}
	
		movePlayer();
		updateCamera();
	}
  
	if (this.debugDrawer) 
		this.debugDrawer.update();

	if(theMixer)//null would be false
		theMixer.update(1/120.0);

	requestAnimationFrame( renderFrame );
	renderer.render(scene, camera);
}

///////////////////////////////////////////////////////////////////////////////////////
//	EVENT HANDLERS / CONTROLLERS
///////////////////////////////////////////////////////////////////////////////////////

function setupEventHandlers(){
	window.addEventListener( 'resize', onWindowResize, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );
	window.addEventListener( 'mousemove', on_Mouse_Move, false );
	document.addEventListener('mousedown', menu_Selection, false);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onKeyDown (event ) {
	switch ( event.keyCode ) {
		case 87: // w
			playerMoveDirection.forward = 1;
			break;

		case 65: // a
			playerMoveDirection.left = 1;
			break;

		case 83: // s
			playerMoveDirection.back = 1;
			break;

		case 68: // d
			playerMoveDirection.right = 1;
			break;

		case 32: // space
			playerMoveDirection.forward = 0;
			playerMoveDirection.left = 0;
			playerMoveDirection.back = 0;
			playerMoveDirection.right = 0;
			let resultantImpulse = new Ammo.btVector3( 0, 5, 0 );
			resultantImpulse.op_mul(2);
			let physicsBody = player.userData.physicsBody;
			physicsBody.applyImpulse( resultantImpulse );
			break;

		case 16: // shift
			player.scale.set(1, 1, 1);
			break;
	}
}

function onKeyUp( event ) {
	switch ( event.keyCode ) {
		case 87: // w
			playerMoveDirection.forward = 0;
			break;

		case 65: // a
			playerMoveDirection.left = 0;
			break;

		case 83: // s
			playerMoveDirection.back = 0;
			break;

		case 68: // d
			playerMoveDirection.right = 0;
			break;

		case 16: // shift
			player.scale.set(2, 2, 2);
			break;

	}
}

function menu_Selection(event) {
	if (playing === false) {
		event.preventDefault();
		raycaster.setFromCamera( mouse, camera );
		let intersects = raycaster.intersectObject(menu_Group, true);

		if (intersects.length > 0) {
			if (intersects[0].object.name === "Select_Level") {
				camera.position.y += 80;
			}

			if (intersects[0].object.name === "Level_1" || intersects[0].object.name === "Level_1_Cube") {
				level = 1;
				load_Manager();
			}

			//if (intersects[0].object.name === "Level_2" || intersects[0].object.name === "Level_2_Cube") {
			//	level = 2;
			//	load_Manager();
			//}

			if (intersects[0].object.name === "Options") {
				camera.position.y -= 80;
			}

			if (intersects[0].object.name === "Back_Level" || intersects[0].object.name === "Back_Options") {
				camera.position.set(0,-10,50);
				camera.lookAt(0, 0, 0);
			}

			if (intersects[0].object.name === "Exit_Game") {
				window.close();
			}
		}
	}
}

function on_Mouse_Move(event) {
	if (playing === false) {
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		raycaster.setFromCamera( mouse, camera );
		let intersects = raycaster.intersectObject(menu_Group, true);

		if (intersects.length > 0) {
			if (intersects[0].object.name === "Grappling_Game") {
				if (intersected_Object)
					intersected_Object.material.emissive.setHex(intersected_Object.currentHex);

				intersected_Object = null;
			}

			else if (intersects[0].object.name === "Level_1_Cube") {
				level_Select_Objects[0].rotation.y += 0.01;
			}

			else if (intersected_Object != intersects[0].object) {
				if (intersected_Object)
					intersected_Object.material.emissive.setHex(intersected_Object.currentHex);

				intersected_Object = intersects[0].object;
				intersected_Object.currentHex = intersected_Object.material.emissive.getHex();
				intersected_Object.material.emissive.setHex(0xdde014);
			}
		} 
		else {
			if (intersected_Object) 
				intersected_Object.material.emissive.setHex(intersected_Object.currentHex);

			intersected_Object = null;
		}
	}
}