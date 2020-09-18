function setupPhysicsWorld(){
    let collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration(),
        dispatcher              = new Ammo.btCollisionDispatcher(collisionConfiguration),
        overlappingPairCache    = new Ammo.btDbvtBroadphase(),
        solver                  = new Ammo.btSequentialImpulseConstraintSolver(),
        softBodySolver = new Ammo.btDefaultSoftBodySolver();

    physicsWorld  = new Ammo.btSoftRigidDynamicsWorld (dispatcher, overlappingPairCache, solver, collisionConfiguration, softBodySolver);
    physicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));
    physicsWorld.debugDrawWorld();
}

function setupControls(){
    //create controls
    controls = new THREE.PointerLockControls( camera, document.body );
    let blocker = document.getElementById( 'blocker' );
    let instructions = document.getElementById( 'instructions' );
    instructions.addEventListener( 'click', function () {controls.lock();}, false );
    controls.addEventListener( 'lock', function () {instructions.style.display = 'none'; blocker.style.display = 'none'; sound.play();
        if(startClock){
            gameClock.start();
            startClock = false;
        }} );
    controls.addEventListener( 'unlock', function () {
        if(gamePlay){
            blocker.style.display = 'block';
        }
        instructions.style.display = ''; sound.pause();} );

    scene.add( controls.getObject() );
}

function initDebug() {
    this.debugDrawer = new THREE.AmmoDebugDrawer(scene, physicsWorld);
    this.debugDrawer.enable();
    this.debugDrawer.setDebugMode(2);

    //setInterval(() => {
    //let mode = (this.debugDrawer.getDebugMode() + 1) % 3;
    //this.debugDrawer.setDebugMode(mode);
    //}, 1000);
}

function showStats(){
    //stats display
    stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );
}

function create_Box_Geometry(scale, pos, quat, texture, has_Boundary) {

    let base_Texture = new THREE.MeshLambertMaterial(texture);
    if (has_Boundary === false) {
        base_Texture.map.wrapS = base_Texture.map.wrapT = THREE.RepeatWrapping;
        base_Texture.map.repeat.set(2, 10);
    }
    let box = new THREE.Mesh(new THREE.BoxBufferGeometry(), base_Texture);
    box.scale.set(scale.x, scale.y, scale.z);
    box.position.set(pos.x, pos.y, pos.z);

    if(has_Boundary === true){
        box.castShadow = true;
        box.receiveShadow = true;
    }
    scene.add(box);

    if (has_Boundary === true) {
        // ammo physics bounding box for each building
        let transform = new Ammo.btTransform();
        transform.setIdentity();
        // set origin using each objects x,y,z coordinates
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        let motionState = new Ammo.btDefaultMotionState(transform);
        // set bounding box using each objects x,y,z scale
        let colShape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x * 0.5 + 0.8, scale.y * 0.5 + 0.5, scale.z * 0.5 + 0.8));
        // colShape.setMargin(0.05);
        let localInertia = new Ammo.btVector3(0, 0, 0);
        colShape.calculateLocalInertia(0, localInertia);
        let rbInfo = new Ammo.btRigidBodyConstructionInfo(0, motionState, colShape, localInertia);
        let body = new Ammo.btRigidBody(rbInfo);
        body.setFriction(4);
        body.setRollingFriction(10);
        box.userData.physicsBody = body;
        physicsWorld.addRigidBody(body, buildingGroup, playerGroup);    // ensures player object and buildings will collide, stopping movement
        platforms.push(box);
    }
}

function createGrapplingHook(platform){
    // The rope
    // Rope graphic object
    let ropeNumSegments = 10;
    let ropeLength = 10;
    let ropeMass = 3;
    let ropePos = player.position.clone();
    ropePos.y += 1;

    let segmentLength = ropeLength / ropeNumSegments;
    let ropeGeometry = new THREE.BufferGeometry();
    let ropeMaterial = new THREE.LineBasicMaterial( { color: 0x000000 } );
    let ropePositions = [];
    let ropeIndices = [];

    for ( let i = 0; i < ropeNumSegments + 1; i++ ) {
        ropePositions.push( ropePos.x, ropePos.y + i * segmentLength, ropePos.z );
    }

    for ( let i = 0; i < ropeNumSegments; i++ ) {
        ropeIndices.push( i, i + 1 );
    }

    ropeGeometry.setIndex( new THREE.BufferAttribute( new Uint16Array( ropeIndices ), 1 ) );
    ropeGeometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( ropePositions ), 3 ) );
    ropeGeometry.computeBoundingSphere();
    rope = new THREE.LineSegments( ropeGeometry, ropeMaterial );
    rope.castShadow = true;
    rope.receiveShadow = true;
    scene.add( rope );

    // Rope physic object
    let softBodyHelpers = new Ammo.btSoftBodyHelpers();
    let ropeStart = new Ammo.btVector3( ropePos.x, ropePos.y, ropePos.z );
    let ropeEnd = new Ammo.btVector3( ropePos.x, ropePos.y + ropeLength, ropePos.z );
    let ropeSoftBody = softBodyHelpers.CreateRope( physicsWorld.getWorldInfo(), ropeStart, ropeEnd, ropeNumSegments - 1, 0 );
    let sbConfig = ropeSoftBody.get_m_cfg();
    sbConfig.set_viterations( 10 );
    sbConfig.set_piterations( 10 );
    ropeSoftBody.setTotalMass( ropeMass, false )
    Ammo.castObject( ropeSoftBody, Ammo.btCollisionObject ).getCollisionShape().setMargin( 0 * 3 );
    physicsWorld.addSoftBody( ropeSoftBody, 1, -1 );
    rope.userData.physicsBody = ropeSoftBody;
    // Disable deactivation
    ropeSoftBody.setActivationState( STATE.DISABLE_DEACTIVATION );



    // Glue the rope extremes to the ball and the arm
    let influence = 1;
    ropeSoftBody.appendAnchor( 0, player.userData.physicsBody, true, influence );
    ropeSoftBody.appendAnchor( ropeNumSegments, platform.userData.physicsBody, true, influence );

}

//function for later use
function lockGrapplingHook(arm){
    // Glue the rope extremes to the ball and the arm
    //let influence = 1;
    //ropeSoftBody.appendAnchor( 0, player.userData.physicsBody, true, influence );
    //ropeSoftBody.appendAnchor( ropeNumSegments, arm.userData.physicsBody, true, influence );
}

function random_Texture() {
    let picker = Math.floor(Math.random() * 9);

    if (picker === 1) {
        return { map: new THREE.TextureLoader().load('texture/buildings/building_Type_2.jpg')};
    }

    else if (picker === 2) {
        return { map: new THREE.TextureLoader().load('texture/buildings/building_Type_3.jpg')};
    }

    else if (picker === 3) {
        return { map: new THREE.TextureLoader().load('texture/buildings/building_Type_5.jpg')};
    }

    else if (picker === 4) {
        return { map: new THREE.TextureLoader().load('texture/buildings/building_Type_6.jpg')};
    }

    else if (picker === 5) {
        return { map: new THREE.TextureLoader().load('texture/buildings/building_Type_7.jpg')};
    }

    else if (picker === 6) {
        return { map: new THREE.TextureLoader().load('texture/buildings/building_Type_8.jpg')};
    }

    else if (picker === 7) {
        return { map: new THREE.TextureLoader().load('texture/buildings/building_Type_9.jpg')};
    }

    else {
        return { map: new THREE.TextureLoader().load('texture/buildings/building_Type_10.jpg')};
    }
}