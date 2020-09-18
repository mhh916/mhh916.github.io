function createGameStage() {
    "use strict";
    var groundObjects = [];

    function createGround() {
        
        var pos = {x: -53, y: 0, z: 0};
        var pgPos = {x: -64, y: 0, z: 4};
        
        var scale = {x: 5, y: 2, z: 5};
        var pgScale = {x: 30, y: 2, z: 11};
        
        var quat = {x: 0,y: 0, z: 0, w: 1};
        var mass = 0;
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        //Physics for newly created objects
        var platformGTransform = new Ammo.btTransform();
            platformGTransform.setIdentity();
            platformGTransform.setOrigin( new Ammo.btVector3( pgPos.x, pgPos.y, pgPos.z ) );
            platformGTransform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
        var platformGMotionState = new Ammo.btDefaultMotionState( platformGTransform );
        var platformGColShape = new Ammo.btBoxShape( new Ammo.btVector3( pgScale.x * 0.5, pgScale.y * 0.5, pgScale.z * 0.5 ) );
            platformGColShape.setMargin( 0.05 );
        var platformGLocalInertia = new Ammo.btVector3( 0, 0, 0 );
            platformGColShape.calculateLocalInertia( mass, platformGLocalInertia );
        var platformGRBInfo = new Ammo.btRigidBodyConstructionInfo( mass, platformGMotionState, platformGColShape, platformGLocalInertia );
        var platformGBody = new Ammo.btRigidBody( platformGRBInfo );
            platformGBody.setFriction(4);
            platformGBody.setRollingFriction(10);
	
            physicsWorld.addRigidBody( platformGBody );
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        //for loop to create new box objects
        for (var i = 0; i < 5; i++) {
            
            var boxG1 = "box";
            boxG1.concat(i.toString);
            
            var boxG1 = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xa0afa4 }));
                boxG1.position.set((pos.x - (i * 6) ), pos.y, pos.z);
                boxG1.scale.set(scale.x, scale.y, scale.z);
                boxG1.castShadow = true;
                boxG1.receiveShadow = true;
            
            scene.add(boxG1);
            groundObjects.push(boxG1);
        }
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        //for loop to create new box objects with different positions
        for (var i = 0; i < 5; i++) {
            
            var boxG2 = "box";
            boxG2.concat(i.toString);
            
            var boxG2 = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xa0afa4 }));
                boxG2.position.set((pos.x - (i * 6) ), pos.y, pos.z + 6);
                boxG2.scale.set(scale.x, scale.y, scale.z);
                boxG2.castShadow = true;
                boxG2.receiveShadow = true;
            
            scene.add(boxG2);
            groundObjects.push(boxG2);
        }
            
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }
    createGround();
}

function createTestGround() {
        
        //object position variables
        var ledge1Pos = {x: 25, y: 10, z: 0};
        var ledge2Pos = {x: -5, y: 10, z: 0};
        var rampPos = {x: 25, y: 2.65, z: 16.2};
        var box1Pos = {x: 11, y: 3, z: 0};

        //object scale variables
        var ledgeScale = {x: 20, y: 1, z: 20};
        var rampScale = {x: 20, y: 1, z: 15};
        var boxScale = {x: 5, y: 5, z: 5};

        //object quaternion variables
        var quat = {x: 0, y: 0, z: 0, w: 1};
        var rampQuat = {x: Math.cos(45), y: 0, z: 0, w: 1};
    
        //object mass
        var mass = 0;
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        //ledge1 creation
        var ledge1 = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xa0afa4 }));
            ledge1.position.set(ledge1Pos.x, ledge1Pos.y, ledge1Pos.z-40);
            ledge1.scale.set(ledgeScale.x, ledgeScale.y, 100);
            ledge1.castShadow = true;
            ledge1.receiveShadow = true;

            scene.add(ledge1);
        
        //ledge1 transform
        var ledge1Transform = new Ammo.btTransform();
            ledge1Transform.setIdentity();
            ledge1Transform.setOrigin( new Ammo.btVector3( ledge1Pos.x, ledge1Pos.y, ledge1Pos.z-40 ) );
            ledge1Transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
        var ledge1MotionState = new Ammo.btDefaultMotionState( ledge1Transform );
        var ledge1ColShape = new Ammo.btBoxShape( new Ammo.btVector3( ledgeScale.x * 0.5, ledgeScale.y * 0.5, 100 * 0.5 ) );
            ledge1ColShape.setMargin( 0.05 );
        var ledge1LocalInertia = new Ammo.btVector3( 0, 0, 0 );
            ledge1ColShape.calculateLocalInertia( mass, ledge1LocalInertia );
        var ledge1RBInfo = new Ammo.btRigidBodyConstructionInfo( mass, ledge1MotionState, ledge1ColShape, ledge1LocalInertia );
        var ledge1Body = new Ammo.btRigidBody( ledge1RBInfo );
            ledge1Body.setFriction(4);
            ledge1Body.setRollingFriction(10);
	
            physicsWorld.addRigidBody( ledge1Body );

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        //ledge2 creation
        var ledge2 = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xa0afa4 }));
            ledge2.position.set(ledge2Pos.x, ledge2Pos.y, ledge2Pos.z);
            ledge2.scale.set(ledgeScale.x, ledgeScale.y, ledgeScale.z);
            ledge2.castShadow = true;
            ledge2.receiveShadow = true;
    
            scene.add(ledge2);
        
        //ledge2 transform
        var ledge2Transform = new Ammo.btTransform();
            ledge2Transform.setIdentity();
            ledge2Transform.setOrigin( new Ammo.btVector3( ledge2Pos.x, ledge2Pos.y, ledge2Pos.z ) );
            ledge2Transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
        var ledge2MotionState = new Ammo.btDefaultMotionState( ledge2Transform );
        var ledge2ColShape = new Ammo.btBoxShape( new Ammo.btVector3( ledgeScale.x * 0.5, ledgeScale.y * 0.5, ledgeScale.z * 0.5 ) );
            ledge2ColShape.setMargin( 0.05 );
        var ledge2LocalInertia = new Ammo.btVector3( 0, 0, 0 );
            ledge2ColShape.calculateLocalInertia( mass, ledge2LocalInertia );
        var ledge2RBInfo = new Ammo.btRigidBodyConstructionInfo( mass, ledge2MotionState, ledge2ColShape, ledge2LocalInertia );
        var ledge2Body = new Ammo.btRigidBody( ledge2RBInfo );
            ledge2Body.setFriction(4);
            ledge2Body.setRollingFriction(10);
	
            physicsWorld.addRigidBody( ledge2Body );

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        //box1Test creation
        var box1Test = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xa0afa4 }));
            box1Test.position.set(box1Pos.x, box1Pos.y, box1Pos.z);
            box1Test.scale.set(boxScale.x, boxScale.y, boxScale.z);
            box1Test.castShadow = true;
            box1Test.receiveShadow = true;
    
            scene.add(box1Test);
        
        //box1Test transform
        var box1Transform = new Ammo.btTransform();
            box1Transform.setIdentity();
            box1Transform.setOrigin( new Ammo.btVector3( box1Pos.x, box1Pos.y, box1Pos.z ) );
            box1Transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
        var box1MotionState = new Ammo.btDefaultMotionState( box1Transform );
        var box1ColShape = new Ammo.btBoxShape( new Ammo.btVector3( boxScale.x * 0.5, boxScale.y * 0.5, boxScale.z * 0.5 ) );
            box1ColShape.setMargin( 0.05 );
        var box1LocalInertia = new Ammo.btVector3( 0, 0, 0 );
            box1ColShape.calculateLocalInertia( mass, box1LocalInertia );
        var box1RBInfo = new Ammo.btRigidBodyConstructionInfo( mass, box1MotionState, box1ColShape, box1LocalInertia );
        var box1Body = new Ammo.btRigidBody( box1RBInfo );
            box1Body.setFriction(4);
            box1Body.setRollingFriction(10);

            physicsWorld.addRigidBody( box1Body );
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //ramp creation
        var ramp = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xa0afa4 }));
            ramp.position.set(rampPos.x, rampPos.y, rampPos.z);
            ramp.scale.set(ledgeScale.x, ledgeScale.y, ledgeScale.z);
            ramp.castShadow = true;
            ramp.receiveShadow = true;
            ramp.rotation.x = Math.sin(45);
    
            scene.add(ramp);
        
        //ramp transform
        var rampTransform = new Ammo.btTransform();
            rampTransform.setIdentity();
            rampTransform.setOrigin( new Ammo.btVector3( rampPos.x, rampPos.y + 1, rampPos.z - 1 ) );
            rampTransform.setRotation( new Ammo.btQuaternion( rampQuat.x, rampQuat.y, rampQuat.z, rampQuat.w ) );
        var rampMotionState = new Ammo.btDefaultMotionState( rampTransform );
        var rampColShape = new Ammo.btBoxShape( new Ammo.btVector3( rampScale.x * 0.5, rampScale.y * 0.5, rampScale.z * 0.5 ) );
            rampColShape.setMargin( 0.05 );
        var rampLocalInertia = new Ammo.btVector3( 0, 0, 0 );
            rampColShape.calculateLocalInertia( mass, rampLocalInertia );
        var rampRBInfo = new Ammo.btRigidBodyConstructionInfo( mass, rampMotionState, rampColShape, rampLocalInertia );
        var rampBody = new Ammo.btRigidBody( rampRBInfo );
            rampBody.setFriction(0);
            rampBody.setRollingFriction(10);
	
        physicsWorld.addRigidBody( rampBody );
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }
    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    function createStartPoint() {
        var geometry = new THREE.TorusBufferGeometry( 20, 2, 16, 100 );
        var material = new THREE.MeshBasicMaterial( { color: 0x79a1e0 } );
        var torus = new THREE.Mesh( geometry, material );
        torus.position.set(0, 20, 0);
        torus.scale.set(1, 1, 1);
        torus.rotation.x = THREE.Math.degToRad(90);
        torus.castShadow = true;
        torus.receiveShadow = true;
        
        scene.add( torus );
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function createDynamicGround() {
        
        var pos = {x: -53,y: 0,z: -12};
        var scale = {x: 5,y: 2,z: 5};
        var quat = {x: 0,y: 0, z: 0, w: 1};
        var mass = 0;
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        var box1 = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xa0afa4 }));
            box1.position.set(pos.x, pos.y, pos.z);
            box1.scale.set(scale.x, scale.y, scale.z);
            box1.castShadow = true;
            box1.receiveShadow = true;
    
            scene.add(box1);
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        var box2 = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xa0afa4 }));
            box2.position.set(pos.x, pos.y, pos.z + 6);
            box2.scale.set(scale.x, scale.y, scale.z);
            box2.castShadow = true;
            box2.receiveShadow = true;
    
            scene.add(box2);
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        var box3 = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xa0afa4 }));
            box3.position.set(pos.x - 6, pos.y, pos.z);
            box3.scale.set(scale.x, scale.y, scale.z);
            box3.castShadow = true;
            box3.receiveShadow = true;
    
            scene.add(box3);
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        var box4 = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xa0afa4 }));
            box4.position.set(pos.x - 6, pos.y, pos.z + 6);
            box4.scale.set(scale.x, scale.y, scale.z);
            box4.castShadow = true;
            box4.receiveShadow = true;
    
            scene.add(box4);
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        var box5 = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xa0afa4 }));
            box5.position.set(pos.x - 12, pos.y, pos.z);
            box5.scale.set(scale.x, scale.y, scale.z);
            box5.castShadow = true;
            box5.receiveShadow = true;
    
            scene.add(box5);
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        var box6 = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xa0afa4 }));
            box6.position.set(pos.x - 12, pos.y, pos.z + 6);
            box6.scale.set(scale.x, scale.y, scale.z);
            box6.castShadow = true;
            box6.receiveShadow = true;
    
            scene.add(box6);
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        var box7 = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xa0afa4 }));
            box7.position.set(pos.x - 18, pos.y, pos.z);
            box7.scale.set(scale.x, scale.y, scale.z);
            box7.castShadow = true;
            box7.receiveShadow = true;
    
            scene.add(box7);
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        var box8 = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xa0afa4 }));
            box8.position.set(pos.x - 18, pos.y, pos.z + 6);
            box8.scale.set(scale.x, scale.y, scale.z);
            box8.castShadow = true;
            box8.receiveShadow = true;
    
            scene.add(box8);
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        var box9 = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xa0afa4 }));
            box9.position.set(pos.x - 24, pos.y, pos.z);
            box9.scale.set(scale.x, scale.y, scale.z);
            box9.castShadow = true;
            box9.receiveShadow = true;
    
            scene.add(box9);
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        var box10 = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xa0afa4 }));
            box10.position.set(pos.x - 24, pos.y, pos.z + 6);
            box10.scale.set(scale.x, scale.y, scale.z);
            box10.castShadow = true;
            box10.receiveShadow = true;
    
            scene.add(box10);
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }