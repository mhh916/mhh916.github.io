function createLevel2() {
    // sets load_Menu to be invisible, and all other css styles to be visible
    document.getElementById("blocker").style.display = "block";
    document.getElementById("instructions").style.display = "";
    document.getElementById("load").style.display = "none";
 
     camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
     scene.fog = new THREE.Fog(0x6c7578, 150, 750);
 
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

     function createPlatform() {
        scale = {x: 60, y: 2, z: 20};
        pos = {x: 0, y: 99, z: 0};
        quat = {x: 0, y: 0, z: 0, w: 1};
        has_Boundry = true;

        texture = new THREE.MeshLambertMaterial({color: 0x83a3d6});

        create_Box_Geometry(scale, pos, quat, texture, has_Boundry);
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

    gamePlay = true;
    setupControls();//game can start with a click after external files are loaded in

    createPlatform();
    createPlayer();
    renderFrame();//starts the loop once the models are loaded
}