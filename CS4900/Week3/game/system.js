function setupPhysicsWorld(){
    let collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration(),
        dispatcher              = new Ammo.btCollisionDispatcher(collisionConfiguration),
        overlappingPairCache    = new Ammo.btDbvtBroadphase(),
        solver                  = new Ammo.btSequentialImpulseConstraintSolver();

    physicsWorld  = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
    physicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));
    physicsWorld.debugDrawWorld();

}

function setupControls(){
    //create controls
    controls = new THREE.PointerLockControls( camera, document.body );
    let blocker = document.getElementById( 'blocker' );
    let instructions = document.getElementById( 'instructions' );
    instructions.addEventListener( 'click', function () {controls.lock();}, false );
    controls.addEventListener( 'lock', function () {instructions.style.display = 'none'; blocker.style.display = 'none'; sound.play();} );
    controls.addEventListener( 'unlock', function () {blocker.style.display = 'block'; instructions.style.display = ''; sound.pause();} );
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