function createLevel1() {
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

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

	dirLight.shadow.camera.left = -200;
	dirLight.shadow.camera.right = 200;
	dirLight.shadow.camera.top = 200;
	dirLight.shadow.camera.bottom = -200;

    dirLight.shadow.camera.far = 13500;
    
    //let helper = new THREE.CameraHelper( dirLight.shadow.camera );
    //scene.add( helper );

    function createSkyBox() {
    scene.background = new THREE.CubeTextureLoader().setPath( 'texture/skybox/' ).load(
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

        let groundMaterial = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('texture/city_Ground_1.jpg')});
            groundMaterial.map.wrapS = groundMaterial.map.wrapT = THREE.RepeatWrapping;
            groundMaterial.map.repeat.set(100, 100);
        let ground = new THREE.Mesh(new THREE.BoxBufferGeometry(), groundMaterial);
            ground.position.set(0, 0, 0);
            ground.scale.set(1000, 0.5, 1000);
            ground.receiveShadow = true;

            scene.add(ground);
    }

    function createStartPlatform() {
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        var mass = 0;

        //create base of starter platform
        let base_Texture = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('texture/building_Type_3.jpg')})
            base_Texture.map.wrapS = base_Texture.map.wrapT = THREE.RepeatWrapping;
        let startPlatformBox = new THREE.Mesh(new THREE.BoxBufferGeometry(), base_Texture);
            startPlatformBox.position.set(0, 25, 0);
            startPlatformBox.scale.set(25, 50, 25);
            startPlatformBox.receiveShadow = true;

            scene.add(startPlatformBox);

        //physics for base
        var starterBoxTransform = new Ammo.btTransform();
            starterBoxTransform.setIdentity();
            starterBoxTransform.setOrigin(new Ammo.btVector3(0, 0, 0));
            starterBoxTransform.setRotation(new Ammo.btQuaternion(0, 0, 0, 1));
        var starterBoxMotionState = new Ammo.btDefaultMotionState(starterBoxTransform);
        var starterBoxColShape = new Ammo.btBoxShape(new Ammo.btVector3(14, 51, 14));
            starterBoxColShape.setMargin(0.05);
        var starterBoxLocalInertia = new Ammo.btVector3(0, 0, 0);
            starterBoxColShape.calculateLocalInertia(mass, starterBoxLocalInertia);
        var starterBoxRbInfo = new Ammo.btRigidBodyConstructionInfo(mass, starterBoxMotionState, starterBoxColShape, starterBoxLocalInertia);
        var starterBoxBody = new Ammo.btRigidBody(starterBoxRbInfo);
            starterBoxBody.setFriction(4);
            starterBoxBody.setRollingFriction(10);
            physicsWorld.addRigidBody(starterBoxBody);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }

    function createCityScape() {
        let static_Buildings = [];

        for (var i = 50; i < 100; i++) {

            if (Math.random() * 11 > 5) {
                var j = -1;
            }
            else
                var j = 1;

            if (Math.random() * 11 > 5)
                var k = -1;
            else
                var k = 1;

            var posX = j * Math.random() * i * 5 / 2;
            var posZ = k * Math.random() * i * 5 / 2;

            var scaleX = Math.random() * 25 + 10;
            var sclaeZ = Math.random() * 25 + 10;

            var height = Math.random() * 50 + 20;
            var mass = 0;

            var t = Math.random() * 4;
            if (t > 3) {
                var material = new THREE.MeshLambertMaterial({map :new THREE.TextureLoader().load('texture/building_Type_1.jpg')});
                material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
                material.map.repeat.set(5, 5);
            }
            else if (t > 1) {
                var material = new THREE.MeshLambertMaterial({map :new THREE.TextureLoader().load('texture/building_Type_2.jpg')});
                material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
                material.map.repeat.set(5, 5);
            }
            else {
                var material = new THREE.MeshLambertMaterial({map :new THREE.TextureLoader().load('texture/building_Type_3.jpg')});
                material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
                material.map.repeat.set(5, 5);
            }

            let building = new THREE.Mesh(new THREE.BoxBufferGeometry(), material);
                building.position.set(posX, height / 2, posZ);
                building.scale.set(scaleX, height, sclaeZ);
                building.castShadow = true;
                building.receiveShadow = true;

            var starterBoxTransform = new Ammo.btTransform();
                starterBoxTransform.setIdentity();
                starterBoxTransform.setOrigin(new Ammo.btVector3(posX, height / 2, posZ));
                starterBoxTransform.setRotation(new Ammo.btQuaternion(0, 0, 0, 1));
            var starterBoxMotionState = new Ammo.btDefaultMotionState(starterBoxTransform);
            var starterBoxColShape = new Ammo.btBoxShape(new Ammo.btVector3(scaleX * 0.5 + 1, height * 0.5 + 1, sclaeZ * 0.5 + 1));
                starterBoxColShape.setMargin(0.05);
            var starterBoxLocalInertia = new Ammo.btVector3(0, 0, 0);
                starterBoxColShape.calculateLocalInertia(mass, starterBoxLocalInertia);
            var starterBoxRbInfo = new Ammo.btRigidBodyConstructionInfo(mass, starterBoxMotionState, starterBoxColShape, starterBoxLocalInertia);
            var starterBoxBody = new Ammo.btRigidBody(starterBoxRbInfo);
                starterBoxBody.setFriction(4);
                starterBoxBody.setRollingFriction(10);
                physicsWorld.addRigidBody(starterBoxBody);

            static_Buildings.push(building);
        }
        for (x in static_Buildings) {
            scene.add(static_Buildings[x]);
        }
    }

    setupPhysicsWorld();
    initDebug();
    createSkyBox();
    createGround();
    createStartPlatform();
    createCityScape();
}
