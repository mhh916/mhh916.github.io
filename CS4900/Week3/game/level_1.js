function createLevel1() {
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    
    scene.fog = new THREE.Fog(0x6c7578, 150, 750);



    //Add hemisphere light
	let hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.1 );
	hemiLight.color.setHSL( 0.6, 0.6, 0.6 );
	hemiLight.groundColor.setHSL( 0.1, 1, 0.4 );
	hemiLight.position.set( 0, 50, 0 );
	scene.add( hemiLight );

	//Add directional light
	let dirLight = new THREE.DirectionalLight( 0xffffff , 1);
	dirLight.color.setHSL( 0.1, 1, 0.95 );
	dirLight.position.set( -1, 1.75, 1 );
	dirLight.position.multiplyScalar( 100 );
	scene.add( dirLight );

	dirLight.castShadow = true;

	dirLight.shadow.mapSize.width = 4096;
	dirLight.shadow.mapSize.height = 4096;

	dirLight.shadow.camera.left = -500;
	dirLight.shadow.camera.right = 500;
	dirLight.shadow.camera.top = 500;
	dirLight.shadow.camera.bottom = -500;

    dirLight.shadow.camera.far = 13500;
    
    let helper = new THREE.CameraHelper( dirLight.shadow.camera );
    scene.add( helper );

    function createSkyBox() {
    scene.background = new THREE.CubeTextureLoader().setPath( './texture/skybox/' ).load(
        [
		    'bluecloud_right.jpg',
		    'bluecloud_left.jpg',
		    'bluecloud_up.jpg',
		    'bluecloud_down.jpg',
		    'bluecloud_back.jpg',
		    'bluecloud_front.jpg'
	    ]);
    }

    function createGround() {



        let groundMaterial = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('texture/buildings/city_Ground_1.jpg')});
            groundMaterial.map.wrapS = groundMaterial.map.wrapT = THREE.RepeatWrapping;
            groundMaterial.map.repeat.set(10, 10);
        let ground = new THREE.Mesh(new THREE.BoxBufferGeometry(), groundMaterial);
            ground.position.set(0, 0, 0);
            ground.scale.set(10000, 0.5, 10000);
            ground.receiveShadow = true;

            scene.add(ground);
    }

    function createStartPlatform() {
        let pos = {x: 0, y: 50, z: 0};
        let scale = {x: 15, y: 100, z: 15};

        let mass = 0;

        //create base of starter platform
        //let base_Texture = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('texture/building_Type_3.jpg')})
        let base_Texture = [
            new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('texture/buildings/building_Type_3.jpg'), side: THREE.FrontSide }),  //Right
            new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('texture/buildings/building_Type_3.jpg'), side: THREE.FrontSide }),  //Left
            new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('texture/buildings/base_Texture.jpg'), side: THREE.FrontSide }),  //Top
            new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('texture/buildings/building_Type_3.jpg'), side: THREE.FrontSide }),  //Bottom
            new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('texture/buildings/building_Type_3.jpg'), side: THREE.FrontSide }),  //Front
            new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('texture/buildings/building_Type_3.jpg'), side: THREE.FrontSide }),  //Back
        ];
        base_Texture.map.wrapS = base_Texture.map.wrapT = THREE.RepeatWrapping;
        //base_Texture.map.repeat.set(5, 5);
        let startPlatformBox = new THREE.Mesh(new THREE.BoxBufferGeometry(), base_Texture);
        startPlatformBox.position.set(pos.x, pos.y, pos.z);
        startPlatformBox.scale.set(scale.x, scale.y, scale.z);

        startPlatformBox.castShadow = true;
        startPlatformBox.receiveShadow = true;

        scene.add(startPlatformBox);

        //physics for base
        let starterBoxTransform = new Ammo.btTransform();
        starterBoxTransform.setIdentity();
        starterBoxTransform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        starterBoxTransform.setRotation(new Ammo.btQuaternion(0, 0, 0, 1));
        let starterBoxMotionState = new Ammo.btDefaultMotionState(starterBoxTransform);
        let starterBoxColShape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x * 0.5 + 1, scale.y * 0.5 + 0.5, scale.z * 0.5 + 1));
        starterBoxColShape.setMargin(0.05);
        let starterBoxLocalInertia = new Ammo.btVector3(0, 0, 0);
        starterBoxColShape.calculateLocalInertia(mass, starterBoxLocalInertia);
        let starterBoxRbInfo = new Ammo.btRigidBodyConstructionInfo(mass, starterBoxMotionState, starterBoxColShape, starterBoxLocalInertia);
        let starterBoxBody = new Ammo.btRigidBody(starterBoxRbInfo);
        starterBoxBody.setFriction(4);
        starterBoxBody.setRollingFriction(10);
        physicsWorld.addRigidBody(starterBoxBody);
    }
    function createCityScape() {
        let pos = {x: 0, y: 45, z: -75};
        let scale = {x: 40, y: 90, z: 60};

        let mass = 0;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BUILDING 1

        //let building_Texture = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('texture/buildings/building_Type_8.jpg')})
        let building_Texture = new THREE.MeshLambertMaterial({color: 0xcbd1d1});    
            //building_Texture.map.wrapS = building_Texture.map.wrapT = THREE.RepeatWrapping;
            //building_Texture.map.repeat.set(5, 5);
        let building = new THREE.Mesh(new THREE.BoxBufferGeometry(), building_Texture);
            building.position.set(pos.x, pos.y, pos.z);
            building.scale.set(scale.x, scale.y, scale.z);


            building.castShadow = true;
            building.receiveShadow = true;

            scene.add(building);

        //physics for base
        let building_Transform = new Ammo.btTransform();
            building_Transform.setIdentity();
            building_Transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
            building_Transform.setRotation(new Ammo.btQuaternion(0, 0, 0, 1));
        let building_MotionState = new Ammo.btDefaultMotionState(building_Transform);
        let building_ColShape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x * 0.5 + 1, scale.y * 0.5 + 0.5, scale.z * 0.5 + 1));
            building_ColShape.setMargin(0.05);
        let building_LocalInertia = new Ammo.btVector3(0, 0, 0);
            building_ColShape.calculateLocalInertia(mass, building_LocalInertia);
        let building_RbInfo = new Ammo.btRigidBodyConstructionInfo(mass, building_MotionState, building_ColShape, building_LocalInertia);
        let building_Body = new Ammo.btRigidBody(building_RbInfo);
            building_Body.setFriction(4);
            building_Body.setRollingFriction(10);
            physicsWorld.addRigidBody(building_Body, buildingGroup, playerGroup);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BUILDING 2

        //let building_Texture = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('texture/building_Type_8.jpg')})
        let building_Texture2 = new THREE.MeshLambertMaterial({color: 0xcbd1d1});    
            //building_Texture.map.wrapS = building_Texture.map.wrapT = THREE.RepeatWrapping;
            //building_Texture.map.repeat.set(5, 5);
        let building2 = new THREE.Mesh(new THREE.BoxBufferGeometry(), building_Texture2);
            building2.position.set(-42, 50, pos.z - 10);
            building2.scale.set(40, 100, 80);

            scene.add(building2);

        let building_Transform2 = new Ammo.btTransform();
            building_Transform2.setIdentity();
            building_Transform2.setOrigin(new Ammo.btVector3(-42, 50, pos.z - 10));
            building_Transform2.setRotation(new Ammo.btQuaternion(0, 0, 0, 1));
        let building_MotionState2 = new Ammo.btDefaultMotionState(building_Transform2);
        let building_ColShape2 = new Ammo.btBoxShape(new Ammo.btVector3(40 * 0.5 + 1, 100 * 0.5 + 0.5, 80 * 0.5 + 1));
            building_ColShape2.setMargin(0.05);
        let building_LocalInertia2 = new Ammo.btVector3(0, 0, 0);
            building_ColShape2.calculateLocalInertia(mass, building_LocalInertia2);
        let building_RbInfo2 = new Ammo.btRigidBodyConstructionInfo(mass, building_MotionState2, building_ColShape2, building_LocalInertia2);
        let building_Body2 = new Ammo.btRigidBody(building_RbInfo2);
            building_Body2.setFriction(4);
            building_Body2.setRollingFriction(10);
            physicsWorld.addRigidBody(building_Body2, buildingGroup, playerGroup);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BUILDING 3

        let building_Texture3 = new THREE.MeshLambertMaterial({color: 0xcbd1d1});    
            //building_Texture.map.wrapS = building_Texture.map.wrapT = THREE.RepeatWrapping;
            //building_Texture.map.repeat.set(5, 5);
        let building3 = new THREE.Mesh(new THREE.BoxBufferGeometry(), building_Texture3);
            building3.position.set(-5, 90, pos.z - 20);
            building3.scale.set(30, 10, 20);

            scene.add(building3);

        let building_Transform3 = new Ammo.btTransform();
            building_Transform3.setIdentity();
            building_Transform3.setOrigin(new Ammo.btVector3(-5, 90, pos.z - 20));
            building_Transform3.setRotation(new Ammo.btQuaternion(0, 0, 0, 1));
        let building_MotionState3 = new Ammo.btDefaultMotionState(building_Transform3);
        let building_ColShape3 = new Ammo.btBoxShape(new Ammo.btVector3(30 * 0.5 + 1, 10 * 0.5 + 0.5, 20 * 0.5 + 1));
            building_ColShape3.setMargin(0.05);
        let building_LocalInertia3 = new Ammo.btVector3(0, 0, 0);
            building_ColShape3.calculateLocalInertia(mass, building_LocalInertia3);
        let building_RbInfo3 = new Ammo.btRigidBodyConstructionInfo(mass, building_MotionState3, building_ColShape3, building_LocalInertia3);
        let building_Body3 = new Ammo.btRigidBody(building_RbInfo3);
            building_Body3.setFriction(4);
            building_Body3.setRollingFriction(10);
            physicsWorld.addRigidBody(building_Body3, buildingGroup, playerGroup);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BUILDING 4

        let building_Texture4 = new THREE.MeshLambertMaterial({color: 0xcbd1d1});    
        let building4 = new THREE.Mesh(new THREE.BoxBufferGeometry(), building_Texture4);
        building4.position.set(50, 60, pos.z);
        building4.scale.set(50, 120, 60);

        scene.add(building4);

        let building_Transform4 = new Ammo.btTransform();
            building_Transform4.setIdentity();
            building_Transform4.setOrigin(new Ammo.btVector3(50, 60, pos.z));
            building_Transform4.setRotation(new Ammo.btQuaternion(0, 0, 0, 1));
        let building_MotionState4 = new Ammo.btDefaultMotionState(building_Transform4);
        let building_ColShape4 = new Ammo.btBoxShape(new Ammo.btVector3(50 * 0.5 + 1, 120 * 0.5 + 0.5, 60 * 0.5 + 1));
            building_ColShape4.setMargin(0.05);
        let building_LocalInertia4 = new Ammo.btVector3(0, 0, 0);
            building_ColShape4.calculateLocalInertia(mass, building_LocalInertia4);
        let building_RbInfo4 = new Ammo.btRigidBodyConstructionInfo(mass, building_MotionState4, building_ColShape4, building_LocalInertia4);
        let building_Body4 = new Ammo.btRigidBody(building_RbInfo4);
            building_Body4.setFriction(4);
            building_Body4.setRollingFriction(10);
            physicsWorld.addRigidBody(building_Body4, buildingGroup, playerGroup);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   
    }


    function object_Loader(){//https://threejs.org/docs/#examples/en/loaders/OBJLoader
        let loadBar = document.getElementById('load');

        //enemy models
        let catLoader = new THREE.OBJLoader(THREE.DefaultLoadingManager);
        catLoader.load(
            "objects/cat/catGun.txt",
            function(obj) {//onLoad, obj is an Object3D provided by load()
                let tex = new THREE.TextureLoader().load("objects/cat/catGun.png");//possibly 2 quick?
//https://stackoverflow.com/questions/33809423/how-to-apply-texture-on-an-object-loaded-by-objloader
                obj.traverse(function (child) {
                    if (child instanceof THREE.Mesh)
                        child.material.map = tex;
                });

                obj.name = "Enemy";
                obj.position.set(5, 105, -14);//moves the mesh
                obj.rotateX(.3);
                obj.rotateY(-.8);
                obj.rotateZ(.4);
                scene.add(obj);
                loadBar.innerHTML = "";
            },
            function(xhr){//onProgress
                loadBar.innerHTML = "<h2>Loading Models " + (xhr.loaded / xhr.total * 100).toFixed() + "%...</h2>";//#bytes loaded, the header tags at the end maintain the style.
                if(xhr.loaded / xhr.total * 100 == 100){ //if done loading loads next loader
                    flag_Loader(loadBar);

                }

            },
            function(err){//onError
                loadBar.innerHTML = "<h2>Error loading files.</h2>";//#bytes loaded, the header tags at the end maintain the style.
                console.log("error in loading enemy model");
            }
        );
    }

    function flag_Loader(loadBar){
        let listener = new THREE.AudioListener();
        camera.add( listener );

        // create a global audio source
        sound = new THREE.Audio( listener );


        // load a sound and set it as the Audio object's buffer
        let loader = new THREE.OBJLoader(THREE.DefaultLoadingManager);
        loader.load(
            "objects/flag/objFlag.txt",
            function(obj) {//onLoad, obj is an Object3D provided by load()
                //let tex = new THREE.TextureLoader().load("objects/flag/objFlag.png");//possibly 2 quick?
                //https://stackoverflow.com/questions/33809423/how-to-apply-texture-on-an-object-loaded-by-objloader
                //obj.traverse(function (child) {
                //	if (child instanceof THREE.Mesh)
                //		child.material.map = tex;
                //});

                obj.name = "Flag";
                obj.position.set(0, 95, -100);//moves the mesh
                obj.scale.set( .3, .3, .3 );

                let geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
                let material = new THREE.MeshBasicMaterial( { color: 0xffff00} );
                flag = new THREE.Mesh( geometry, material );
                flag.visible = false;

                scene.add(obj);
                scene.add( flag );
                //flag.add(obj);




                //scene.add(obj);

                let transform = new Ammo.btTransform();
                transform.setIdentity();
                transform.setOrigin( new Ammo.btVector3( 0, 98, -100 ) );
                transform.setRotation( new Ammo.btQuaternion( 0, 0, 0, 1 ) );
                let motionState = new Ammo.btDefaultMotionState( transform );

                colShape = new Ammo.btBoxShape(new Ammo.btVector3(3, 3, 3));
                colShape.setMargin( 0.05 );

                let localInertia = new Ammo.btVector3( 0, 0, 0 );
                colShape.calculateLocalInertia( 1, localInertia );

                let rbInfo = new Ammo.btRigidBodyConstructionInfo( 0, motionState, colShape, localInertia );
                let flagBody = new Ammo.btRigidBody( rbInfo );

                flagBody.setFriction(4);
                flagBody.setRollingFriction(10);

                physicsWorld.addRigidBody( flagBody, flagGroup, ghostGroup );

                flag.userData.physicsBody = flagBody;


                rigidBodies.push(flag);



                loadBar.innerHTML = "";
            },
            function(xhr){//onProgress
                loadBar.innerHTML = "<h2>Loading flag " + (xhr.loaded / xhr.total * 100).toFixed() + "%...</h2>";//#bytes loaded, the header tags at the end maintain the style.
                if(xhr.loaded / xhr.total * 100 == 100){ //if done loading loads next loader
                    document.getElementById("blocker").style.display = "block";
                    sound_Loader(loadBar);
                    b = true;
                }
            },
            function(err){//onError
                loadBar.innerHTML = "<h2>Error loading files.</h2>";//#bytes loaded, the header tags at the end maintain the style.
                console.log("error in loading sound");
            }
        );
    }

    function sound_Loader(loadBar){
        let listener = new THREE.AudioListener();
        camera.add( listener );

        // create a global audio source
        sound = new THREE.Audio( listener );


        // load a sound and set it as the Audio object's buffer
        let audioLoader = new THREE.AudioLoader();
        audioLoader.load( './sound/2019-12-11_-_Retro_Platforming_-_David_Fesliyan.mp3',
            function( buffer ) {
                sound.setBuffer( buffer );
                sound.setLoop( true );
                sound.setVolume( 0.25 );
            },
            function(xhr){//onProgress
                loadBar.innerHTML = "<h2>Loading Sounds " + (xhr.loaded / xhr.total * 100).toFixed() + "%...</h2>";//#bytes loaded, the header tags at the end maintain the style.
                if(xhr.loaded / xhr.total * 100 == 100){ //if done loading loads next loader
                    document.getElementById("blocker").style.display = "block";
                    document.getElementById("load").style.display = "none";

                    setupControls();//game can start with a click after external files are loaded in
                    renderFrame();//starts the loop once the models are loaded
                    playing = true;
                }
            },
            function(err){//onError
                loadBar.innerHTML = "<h2>Error loading files.</h2>";//#bytes loaded, the header tags at the end maintain the style.
                console.log("error in loading sound");
            }
        );
    }

    function createPlayer(){
        //var pos = {x: 0, y: 2, z: 3};
        let pos = {x: 0, y: 105, z: 0};
        let radius = 1;
        let quat = {x: 0 , y: 0, z: 0, w: 1};
        let mass = 1;

        player = new THREE.Mesh(new THREE.SphereBufferGeometry(radius), new THREE.MeshPhongMaterial({color: 0xff0505}));

        player.position.set(pos.x, pos.y, pos.z);

        player.castShadow = true;
        player.receiveShadow = true;

        scene.add(player);

        let transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
        transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
        let motionState = new Ammo.btDefaultMotionState( transform );

        let colShape = new Ammo.btSphereShape( radius );
        colShape.setMargin( 0.05 );

        let localInertia = new Ammo.btVector3( 0, 0, 0 );
        colShape.calculateLocalInertia( mass, localInertia );

        let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
        let body = new Ammo.btRigidBody( rbInfo );

        body.setFriction(4);
        body.setRollingFriction(10);


        physicsWorld.addRigidBody( body, playerGroup, buildingGroup );

        player.userData.physicsBody = body;
        player.userData.physicsBody.set



        rigidBodies.push(player);
        a = true;

    }


    setupPhysicsWorld();
    initDebug();
    object_Loader();
    createPlayer();
    createSkyBox();
    createGround();
    createStartPlatform();
    createCityScape();
}
