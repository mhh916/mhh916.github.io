/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  RELIC CODE / MAY REUSE  /   REFERENCE
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        //let base_Texture = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('texture/building_Type_3.jpg')})
    /*    let base_Texture = [
            new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('texture/buildings/building_Type_3.jpg'), side: THREE.FrontSide }),  //Right
            new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('texture/buildings/building_Type_3.jpg'), side: THREE.FrontSide }),  //Left
            new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('texture/buildings/base_Texture.jpg'), side: THREE.FrontSide }),  //Top
            new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('texture/buildings/building_Type_3.jpg'), side: THREE.FrontSide }),  //Bottom
            new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('texture/buildings/building_Type_3.jpg'), side: THREE.FrontSide }),  //Front
            new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('texture/buildings/building_Type_3.jpg'), side: THREE.FrontSide }),  //Back
        ];
            base_Texture.map.wrapS = base_Texture.map.wrapT = THREE.RepeatWrapping;
            base_Texture.map.repeat.set(5, 5);
    */

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createLevel1() {
    // sets load_Menu to be invisible, and all other css styles to be visible
    document.getElementById("load_Menu").style.display = "none";
	  document.getElementById("load").style.display = "";
    document.getElementById("instructions").style.display = "none";


    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    //scene.fog = new THREE.Fog(0x6c7578, 150, 750);

    // add hemisphere light
	let hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.1 );
	    hemiLight.color.setHSL( 0.6, 0.6, 0.6 );
	    hemiLight.groundColor.setHSL( 0.1, 1, 0.4 );
        hemiLight.position.set( 0, 50, 0 );
        
	scene.add( hemiLight );

	// add directional light
	let dirLight = new THREE.DirectionalLight( 0xffffff , 0.75);
	    dirLight.color.setHSL( 0.1, 1, 0.95 );
	    dirLight.position.set( -1, 1.75, 1 );
        dirLight.position.multiplyScalar( 100 );

	    dirLight.castShadow = true;

	    dirLight.shadow.mapSize.width = 4096;
	    dirLight.shadow.mapSize.height = 4096;

	    dirLight.shadow.camera.left = -500;
	    dirLight.shadow.camera.right = 500;
	    dirLight.shadow.camera.top = 500;
	    dirLight.shadow.camera.bottom = -500;

        dirLight.shadow.camera.far = 13500;

    // helper for directional light
    //let helper = new THREE.CameraHelper( dirLight.shadow.camera );

    scene.add( dirLight );
    //scene.add( helper );


    function createSkyBox() {
        let base_Texture = [
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('texture/skybox/bluecloud_right.jpg'), side: THREE.BackSide }),  //Right
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('texture/skybox/bluecloud_left.jpg'), side: THREE.BackSide }),  //Left
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('texture/skybox/bluecloud_up.jpg'), side: THREE.BackSide }),  //Top
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('texture/skybox/bluecloud_down.jpg'), side: THREE.BackSide }),  //Bottom
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('texture/skybox/bluecloud_back.jpg'), side: THREE.BackSide }),  //Back
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('texture/skybox/bluecloud_front.jpg'), side: THREE.BackSide }),  //Front
        ];

        let box = new THREE.Mesh(new THREE.BoxBufferGeometry(), base_Texture);
            box.scale.set(10000, 10000, 10000);
            box.position.set(0, 0, 0);

        scene.add(box);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //  NOTE, THE PLAYER CAN JUMP 45 UNITS LONG AND 5 UNITS HIGH

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function createGround() {
        let groundMaterial = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('texture/buildings/city_Ground_1.jpg')});
            groundMaterial.map.wrapS = groundMaterial.map.wrapT = THREE.RepeatWrapping;
            groundMaterial.map.repeat.set(20, 20);
        let ground = new THREE.Mesh(new THREE.BoxBufferGeometry(), groundMaterial);
            ground.position.set(0, 0, 0);
            ground.scale.set(10000, 0.5, 10000);
            ground.receiveShadow = true;

            scene.add(ground);
    }

    function create_Course() {
        let scale, pos, quat, texture, has_Boundry;

    //PLATFORMS DENOTED BY P#

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // START BUILDING

        scale = {x: 60, y: 2, z: 20};
        pos = {x: 0, y: 99, z: 0};
        quat = {x: 0, y: 0, z: 0, w: 1};
        has_Boundry = true;

        texture = new THREE.MeshLambertMaterial({color: 0x83a3d6});

        create_Box_Geometry(scale, pos, quat, texture, has_Boundry);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // P1
        
        scale = {x: 60, y: 2, z: 20};
        pos = {x: 0, y: 94, z: -60};
        quat = {x: 0, y: 0, z: 0, w: 1};
        has_Boundry = true;

        texture = new THREE.MeshLambertMaterial({color: 0x83a3d6});

        create_Box_Geometry(scale, pos, quat, texture, has_Boundry);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // P2
        
        scale = {x: 60, y: 2, z: 60};
        pos = {x: -40, y: 99, z: -120};
        quat = {x: 0, y: 0, z: 0, w: 1};
        has_Boundry = true;

        texture = new THREE.MeshLambertMaterial({color: 0x83a3d6});

        create_Box_Geometry(scale, pos, quat, texture, has_Boundry);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // P3

        scale = {x: 20, y: 2, z: 10};
        pos = {x: -30, y: 119, z: -95};
        quat = {x: 0, y: 0, z: 0, w: 1};
        has_Boundry = true;

        texture = new THREE.MeshLambertMaterial({color: 0x83a3d6});

        create_Box_Geometry(scale, pos, quat, texture, has_Boundry);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // P4

        scale = {x: 10, y: 2, z: 60};
        pos = {x: -65, y: 114, z: -120};
        quat = {x: 0, y: 0, z: 0, w: 1};
        has_Boundry = true;

        texture = new THREE.MeshLambertMaterial({color: 0x83a3d6});

        create_Box_Geometry(scale, pos, quat, texture, has_Boundry);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // P5

        scale = {x: 20, y: 2, z: 20};
        pos = {x: -20, y: 104, z: -180};
        quat = {x: 0, y: 0, z: 0, w: 1};
        has_Boundry = true;

        texture = new THREE.MeshLambertMaterial({color: 0x83a3d6});

        create_Box_Geometry(scale, pos, quat, texture, has_Boundry);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // P6

        scale = {x: 20, y: 2, z: 20};
        pos = {x: -60, y: 109, z: -180};
        quat = {x: 0, y: 0, z: 0, w: 1};
        has_Boundry = true;

        texture = new THREE.MeshLambertMaterial({color: 0x83a3d6});

        create_Box_Geometry(scale, pos, quat, texture, has_Boundry);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // P7

        scale = {x: 2, y: 40, z: 100};
        pos = {x: 5, y: 105, z: -140};
        quat = {x: 0, y: 0, z: 0, w: 1};
        has_Boundry = true;

        texture = new THREE.MeshLambertMaterial({color: 0x83a3d6});

        create_Box_Geometry(scale, pos, quat, texture, has_Boundry);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // P8

        scale = {x: 10, y: 2, z: 80};
        pos = {x: 25, y: 99, z: -140};
        quat = {x: 0, y: 0, z: 0, w: 1};
        has_Boundry = true;

        texture = new THREE.MeshLambertMaterial({color: 0x83a3d6});

        create_Box_Geometry(scale, pos, quat, texture, has_Boundry);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // P9

        scale = {x: 20, y: 2, z: 40};
        pos = {x: 50, y: 94, z: -220};
        quat = {x: 0, y: 0, z: 0, w: 1};
        has_Boundry = true;

        texture = new THREE.MeshLambertMaterial({color: 0x83a3d6});

        create_Box_Geometry(scale, pos, quat, texture, has_Boundry);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // P10

        scale = {x: 20, y: 2, z: 60};
        pos = {x: 130, y: 99, z: -230};
        quat = {x: 0, y: 0, z: 0, w: 1};
        has_Boundry = true;

        texture = new THREE.MeshLambertMaterial({color: 0x83a3d6});

        create_Box_Geometry(scale, pos, quat, texture, has_Boundry);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // P11

        scale = {x: 2, y: 10, z: 60};
        pos = {x: 75, y: 100, z: -290};
        quat = {x: 0, y: 0, z: 0, w: 1};
        has_Boundry = true;

        texture = new THREE.MeshLambertMaterial({color: 0x83a3d6});

        create_Box_Geometry(scale, pos, quat, texture, has_Boundry);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // P12

        scale = {x: 40, y: 2, z: 2};
        pos = {x: 0, y: 134, z: -280};
        quat = {x: 0, y: 0, z: 0, w: 1};
        has_Boundry = true;

        texture = new THREE.MeshLambertMaterial({color: 0x83a3d6});

        create_Box_Geometry(scale, pos, quat, texture, has_Boundry);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // P13

        scale = {x: 20, y: 2, z: 100};
        pos = {x: -90, y: 119, z: -280};
        quat = {x: 0, y: 0, z: 0, w: 1};
        has_Boundry = true;

        texture = new THREE.MeshLambertMaterial({color: 0x83a3d6});

        create_Box_Geometry(scale, pos, quat, texture, has_Boundry);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // P14

        scale = {x: 20, y: 2, z: 40};
        pos = {x: 50, y: 99, z: -360};
        quat = {x: 0, y: 0, z: 0, w: 1};
        has_Boundry = true;

        texture = new THREE.MeshLambertMaterial({color: 0x83a3d6});

        create_Box_Geometry(scale, pos, quat, texture, has_Boundry);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // P15

        scale = {x: 20, y: 2, z: 20};
        pos = {x: 50, y: 104, z: -410};
        quat = {x: 0, y: 0, z: 0, w: 1};
        has_Boundry = true;

        texture = new THREE.MeshLambertMaterial({color: 0x83a3d6});

        create_Box_Geometry(scale, pos, quat, texture, has_Boundry);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // P16

        scale = {x: 20, y: 2, z: 40};
        pos = {x: 50, y: 109, z: -460};
        quat = {x: 0, y: 0, z: 0, w: 1};
        has_Boundry = true;

        texture = new THREE.MeshLambertMaterial({color: 0x83a3d6});

        create_Box_Geometry(scale, pos, quat, texture, has_Boundry);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // P17

        scale = {x: 40, y: 2, z: 120};
        pos = {x: 10, y: 114, z: -440};
        quat = {x: 0, y: 0, z: 0, w: 1};
        has_Boundry = true;

        texture = new THREE.MeshLambertMaterial({color: 0x83a3d6});

        create_Box_Geometry(scale, pos, quat, texture, has_Boundry);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // P18

        scale = {x: 80, y: 2, z: 60};
        pos = {x: -50, y: 114, z: -470};
        quat = {x: 0, y: 0, z: 0, w: 1};
        has_Boundry = true;

        texture = new THREE.MeshLambertMaterial({color: 0x83a3d6});

        create_Box_Geometry(scale, pos, quat, texture, has_Boundry);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // P19

        scale = {x: 60, y: 115, z: 60};
        pos = {x: -60, y: 57.5, z: -560};
        quat = {x: 0, y: 0, z: 0, w: 1};
        has_Boundry = true;

        texture = new THREE.MeshLambertMaterial({color: 0x83a3d6});

        create_Box_Geometry(scale, pos, quat, texture, has_Boundry);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // P20

        scale = {x: 60, y: 110, z: 40};
        pos = {x: -60, y: 55, z: -640};
        quat = {x: 0, y: 0, z: 0, w: 1};
        has_Boundry = true;

        texture = new THREE.MeshLambertMaterial({color: 0x83a3d6});

        create_Box_Geometry(scale, pos, quat, texture, has_Boundry);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // P20

        scale = {x: 60, y: 110, z: 40};
        pos = {x: 30, y: 55, z: -640};
        quat = {x: 0, y: 0, z: 0, w: 1};
        has_Boundry = true;

        texture = new THREE.MeshLambertMaterial({color: 0x83a3d6});

        create_Box_Geometry(scale, pos, quat, texture, has_Boundry);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }

    function create_Boundary() { 
        let origin = -200;
        let scale, pos, quat, texture, has_Boundry, width, height;

        for (let i = 0; i < 9; i++) {
            width = Math.random() * 10 + 40;
            height = Math.random() * 50 + 150;

            scale = {x: width, y: height, z: width};
            pos = {x: origin, y: height / 2, z: 180};
            quat = {x: 0, y: 0, z: 0, w: 1};
            has_Boundry = false;

            origin += 50;
            texture = random_Texture();

            create_Box_Geometry(scale, pos, quat, texture, has_Boundry);
        }

        origin = 120;

        while (origin > -721) {
            width = Math.random() * 10 + 40;
            height = Math.random() * 50 + 150;

            scale = {x: width, y: height, z: width};
            pos = {x: -200, y: height / 2, z: origin};
            quat = {x: 0, y: 0, z: 0, w: 1};
            has_Boundry = false;

            texture = random_Texture();

            create_Box_Geometry(scale, pos, quat, texture, has_Boundry);

            width = Math.random() * 10 + 40;
            height = Math.random() * 50 + 180;

            scale = {x: width, y: height, z: width};
            pos = {x: 200, y: height / 2, z: origin};
            quat = {x: 0, y: 0, z: 0, w: 1};
            has_Boundry = false;

            texture = random_Texture();

            create_Box_Geometry(scale, pos, quat, texture, has_Boundry);
            
            origin -= 50;
        }
    }

    function object_Loader(){//https://threejs.org/docs/#examples/en/loaders/OBJLoader
        let loadBar = document.getElementById('load');

        //enemy models
        let catLoader = new THREE.GLTFLoader();
        catLoader.load(
            "objects/cat/catGun.txt",
            function(obj) {//onLoad, obj is a GLTF
                theMixer = new THREE.AnimationMixer(obj.scene.children[2]);//the mesh itself
                obj.name = "Enemy";

                let pos ={ x: -10, y: 103, z: 0};

                obj.scene.position.x = pos.x;
                obj.scene.position.y = pos.y;
                obj.scene.position.z = pos.z;
                obj.scene.rotation.y = -1.2;

                scene.add(obj.scene);

                let vect3 = new THREE.Vector3();
                let box = new THREE.Box3().setFromObject(obj.scene).getSize(vect3);

                let transform = new Ammo.btTransform();
                transform.setIdentity();
                transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
                transform.setRotation( new Ammo.btQuaternion( 0, 0, 0, 1 ) );
                let motionState = new Ammo.btDefaultMotionState( transform );

                colShape = new Ammo.btBoxShape(new Ammo.btVector3(box.x/2.5, box.y/3, box.z/2.5));
                colShape.setMargin( 0.5 );

                let localInertia = new Ammo.btVector3( 0, 0, 0 );
                colShape.calculateLocalInertia( 1, localInertia );

                let rbInfo = new Ammo.btRigidBodyConstructionInfo( 1, motionState, colShape, localInertia );
                let objBody = new Ammo.btRigidBody( rbInfo );

                objBody.setFriction(4);
                objBody.setRollingFriction(10);

                physicsWorld.addRigidBody( objBody, playerGroup, buildingGroup );

                obj.scene.userData.physicsBody = objBody;


                rigidBodies.push(obj.scene);

                //animation for catGun
                let anims = obj.animations;
                //let aClip = THEE.AnimationClip.findByName(anims, "Walk");...
                /*
                anims.forEach(function(aClip){
                    theMixer.clipAction(aClip).play();//returns an Animation Action that's played with play()
                });
                */
                theMixer.clipAction(anims[0]).play();//"death" doesn't play for some reason





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
                console.log(err);
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
                let pos ={ x: 5, y: 125, z: -100};
                obj.name = "Flag";
                obj.position.set(pos.x, pos.y, pos.z);//moves the mesh
                obj.scale.set( .3, .3, .3 );

                let geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
                let material = new THREE.MeshBasicMaterial( { color: 0xffff00} );
                let vect3 = new THREE.Vector3();
                let box = new THREE.Box3().setFromObject(obj).getSize(vect3);

                flag = new THREE.Mesh( geometry, material );
                flag.visible = false;

                scene.add(obj);
                scene.add( flag );
                //flag.add(obj);




                //scene.add(obj);

                let transform = new Ammo.btTransform();
                transform.setIdentity();
                transform.setOrigin( new Ammo.btVector3( pos.x, pos.y+4, pos.z ) );
                transform.setRotation( new Ammo.btQuaternion( 0, 0, 0, 1 ) );
                let motionState = new Ammo.btDefaultMotionState( transform );

                colShape = new Ammo.btBoxShape(new Ammo.btVector3(box.x/2, box.y/2, box.z/2));
                colShape.setMargin( 0.5 );

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
                    document.getElementById("instructions").style.display = "";
                    document.getElementById("load").style.display = "none";

                    setupControls();//game can start with a click after external files are loaded in
                    renderFrame();//starts the loop once the models are loaded
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

        body.setActivationState(STATE.DISABLE_DEACTIVATION);

        physicsWorld.addRigidBody( body, playerGroup, buildingGroup );

        player.userData.physicsBody = body;
        player.userData.physicsBody.set

        rigidBodies.push(player);
        a = true;

    }

    setupPhysicsWorld();
    initDebug();
    gamePlay = true;
    object_Loader();
    createPlayer();

    createSkyBox();
    createGround();
    create_Course();
    create_Boundary();
    after_Game_Menu();

}
