// initialize WebGL and THREE renderer
var width = window.innerWidth;
var height = window.innerHeight;
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

var key = [];
var cameraLookAt = new THREE.Vector3(0, 0, -1);
var cameraLeft = new THREE.Vector3(-1, 0, 0);
var cameraUp = new THREE.Vector3().crossVectors(cameraLeft, cameraLookAt);
var yaw;
var pitch;



document.addEventListener('mousemove', mouseMove, true);
document.body.addEventListener("keydown", function (k) {
	key[k.keyCode] = true;
});
document.body.addEventListener("keyup", function (k) {
	key[k.keyCode] = false;
});


function mouseMove(event) {
	yaw = event.clientX - width/2;
    pitch = event.clientY - height/2;
	targetX = ( 1 - yaw ) * 0.002;
	targetY = ( 1 - pitch ) * 0.002;
  
	camera.rotation.x += 0.05 * ( targetY - camera.rotation.x );
	camera.rotation.y += 0.05 * ( targetX - camera.rotation.y );
	//console.log("x: " + yaw + " y: " + pitch);
	//cameraLeft.applyAxisAngle(cameraLeft, yaw * Math.pi/180);
	//cameraLookAt.applyAxisAngle(cameraLookAt, pitch * Math.pi/180);
    //set up camera position
    //camera.lookAt(camera.position);
}

// create scene object
var scene = new THREE.Scene;
scene.background = new THREE.Color( 0xffcba4 );


// create simple geometry and add to scene
var cubeGeometry = new THREE.CubeGeometry(15, 15, 15) ;
var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xaaff44}) ;
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial) ;
scene.add(cube);

/*
//Add buildines to scene
for(var i = 0; i < 50; i++){
	var geometry = new THREE.BoxGeometry(10, Math.floor(Math.random() * 20)+5, 10);
	var material = new THREE.MeshLambertMaterial({color: 0xff0000});
	var mesh = new THREE.Mesh(geometry, material);
	
	mesh.position.x = Math.random() * i*20;
	mesh.position.y = 0;
	mesh.position.z = Math.random() * i*30;
	mesh.needsUpdate = true;
	scene.add(mesh);
}*/

// create perspective camera
var camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 10000);
camera.position.x = 0;
camera.position.y = 16;
camera.position.z = 50;

// add to scene and renderer
scene.add(camera);
renderer.render(scene, camera);

// create the view matrix (lookAt)
camera.lookAt(cube.position);
//camera.lookAt(mesh.position);

// add lighting and add to scene
var pointLight = new THREE.PointLight(0xaabbcc);
pointLight.position.set(16, 16, 16);
scene.add(pointLight);


renderer.render(scene, camera);
function render (){
	
	movement();
	//cameraUp = new THREE.Vector3().crossVectors(cameraLeft, cameraLookAt);
	//camera.up = cameraUp;
	//camera.lookAt(cameraLookAt);
	//cube.rotation.y +=0.01;
	
	
	

	requestAnimationFrame( render );
	renderer.render( scene, camera );
}

function movement() {
	//A
    if (key[65]) {
       camera.position.add(cameraLeft);
    }
	//D
    if (key[68]) {
       camera.position.sub(cameraLeft);
    }
	//W
	if (key[83]) {
		camera.position.sub(cameraLookAt);
	}
	//S
	if (key[87]) {
		camera.position.add(cameraLookAt);
	}
}

render () ;

