function create_Start_Menu() {
	document.getElementById("instructions").style.display = "none";
	document.getElementById("load").style.display = "none";
	
	let loader = new THREE.FontLoader();
	let loadBar = document.getElementById('load_Menu');

	menu_Group = new THREE.Group();
	function setupGraphics(){
		clock = new THREE.Clock();

		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x0f0f0f);

		//create camera
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 500 );
		camera.position.set(0,-10,50)
		camera.lookAt(0,0,0);

		//setup point light for the scene
		let pointLight = new THREE.PointLight(0xffffff, 1.5);
		pointLight.position.set(0, -30, 100);
		scene.add(pointLight);
		pointLight.color.setHSL(.2, 1, 0.5);

		//Setup the renderer
		renderer = new THREE.WebGLRenderer( { antialias: false } );
		renderer.setClearColor( 0xbfd1e5 );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );

		renderer.shadowMap.enabled = true;
	}

    function main_Menu() {
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//	Grappling_Game
		loader.load( "fonts/28 Days Later_Regular.txt", function ( font ) {

			let textGeo = new THREE.TextBufferGeometry( "Grapple Game", {

				font: font,

				size: 10,
				height: 1,
				curveSegments: 12,

				bevelThickness: 1,
				bevelSize: .5,
				bevelEnabled: true

			} );

				textGeo.computeBoundingBox();
			let centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

			let textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff } );

			let mesh = new THREE.Mesh( textGeo, textMaterial );
				mesh.position.x = centerOffset;
				mesh.position.y = 10;

				mesh.rotation.x = THREE.Math.degToRad(10);

				mesh.name = "Grappling_Game";

				menu_Group.add(mesh);
        	}, 
        	function(xhr){//onProgress
			loadBar.innerHTML = "<h2>Loading Fonts " + (xhr.loaded / xhr.total * 100).toFixed() + "%...</h2>";//#bytes loaded, the header tags at the end maintain the style.
			if(xhr.loaded / xhr.total * 100 == 100){ //if done loading loads next loader
				document.getElementById("load_Menu").style.display = "none";
				document.getElementById("blocker").style.display = "none";
			}
			},
			function(err){//onError
			loadBar.innerHTML = "<h2>Error loading files.</h2>";//#bytes loaded, the header tags at the end maintain the style.
			console.log("error in loading fonts");
			}
		);

	    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//	Select_Level
		loader.load( "fonts/28 Days Later_Regular.txt", function ( font ) {

			let textGeo = new THREE.TextBufferGeometry( "Select Level", {

				font: font,

				size: 5,
				height: 1,
				curveSegments: 12,

				bevelThickness: .5,
				bevelSize: .3,
				bevelEnabled: true

			} );

				textGeo.computeBoundingBox();
            let centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

			let textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff } );

			let mesh = new THREE.Mesh( textGeo, textMaterial );
				mesh.position.x = centerOffset;
				mesh.position.y = -5;
				mesh.rotation.x = THREE.Math.degToRad(-5);

				mesh.name = "Select_Level";

				menu_Group.add(mesh);
        });

	    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Options
		loader.load( "fonts/28 Days Later_Regular.txt", function ( font ) {

			let textGeo = new THREE.TextBufferGeometry( "Options", {

				font: font,

				size: 5,
				height: 1,
				curveSegments: 12,

				bevelThickness: .5,
				bevelSize: .3,
				bevelEnabled: true

			} );

				textGeo.computeBoundingBox();
            let centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

			let textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff } );

			let mesh = new THREE.Mesh( textGeo, textMaterial );
				mesh.position.x = centerOffset;
				mesh.position.y = -15;
				mesh.rotation.x = THREE.Math.degToRad(-10);

				mesh.name = "Options";

				menu_Group.add(mesh);
        });

	    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//	Exit_Game
		loader.load( "fonts/28 Days Later_Regular.txt", function ( font ) {

			let textGeo = new THREE.TextBufferGeometry( "Exit Game", {

				font: font,

				size: 5,
				height: 1,
				curveSegments: 12,

				bevelThickness: .5,
				bevelSize: .3,
				bevelEnabled: true

			} );

				textGeo.computeBoundingBox();
            let centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

			let textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff } );

			let mesh = new THREE.Mesh( textGeo, textMaterial );
				mesh.position.x = centerOffset;
				mesh.position.y = -25;
				mesh.rotation.x = THREE.Math.degToRad(-15);

				mesh.name = "Exit_Game";

				menu_Group.add(mesh);
        });

		scene.add(menu_Group);
	    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }

    function level_Select_Menu() {
		loader.load( "fonts/28 Days Later_Regular.txt", function ( font ) {

			let textGeo = new THREE.TextBufferGeometry( "Back", {

				font: font,

				size: 5,
				height: 1,
				curveSegments: 12,

				bevelThickness: 1,
				bevelSize: .5,
				bevelEnabled: true

			} );

				textGeo.computeBoundingBox();
			let centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

			let textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff } );

			let mesh = new THREE.Mesh( textGeo, textMaterial );
				mesh.position.x = centerOffset;
				mesh.position.x = -50;
				mesh.position.y += 110;

				mesh.rotation.x = THREE.Math.degToRad(30);
				mesh.rotation.y = THREE.Math.degToRad(20);

				mesh.name = "Back_Level";

				menu_Group.add(mesh);
		});

		loader.load( "fonts/28 Days Later_Regular.txt", function ( font ) {

			let textGeo = new THREE.TextBufferGeometry( "Level 1", {

				font: font,

				size: 5,
				height: 1,
				curveSegments: 12,

				bevelThickness: 1,
				bevelSize: .5,
				bevelEnabled: true

			} );

				textGeo.computeBoundingBox();
			let centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

			let textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff } );

			let mesh = new THREE.Mesh( textGeo, textMaterial );
				mesh.position.x = centerOffset;
				mesh.position.x = -45;
				mesh.position.y += 80;

				mesh.rotation.x = THREE.Math.degToRad(30);
				mesh.rotation.y = THREE.Math.degToRad(20);
				mesh.rotation.z = THREE.Math.degToRad(-8);

				mesh.name = "Level_1";

				menu_Group.add(mesh);
		});

		let Level_1_Cube_Texture = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('texture/buildings/building_Type_3.jpg')});
			Level_1_Cube_Texture.map.wrapS = Level_1_Cube_Texture.map.wrapT = THREE.RepeatWrapping;
			Level_1_Cube_Texture.map.repeat.set(1, 1);
        let	Level_1_Cube = new THREE.Mesh(new THREE.BoxBufferGeometry(), Level_1_Cube_Texture);
			Level_1_Cube.position.set(-38, 95, 0);
			Level_1_Cube.scale.set(10, 10, 10);

			Level_1_Cube.name = "Level_1_Cube";
			level_Select_Objects.push(Level_1_Cube);

			menu_Group.add(Level_1_Cube);
		scene.add(menu_Group);
	}

    function options_Menu() {
		loader.load( "fonts/28 Days Later_Regular.txt", function ( font ) {

			let textGeo = new THREE.TextBufferGeometry( "Back", {

				font: font,

				size: 5,
				height: 1,
				curveSegments: 12,

				bevelThickness: 1,
				bevelSize: .5,
				bevelEnabled: true

			} );

				textGeo.computeBoundingBox();
			let centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

			let textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff } );

			let mesh = new THREE.Mesh( textGeo, textMaterial );
				mesh.position.x = centerOffset;
				mesh.position.x = -50;
				mesh.position.y -= 50;

				mesh.rotation.x = THREE.Math.degToRad(30);
				mesh.rotation.y = THREE.Math.degToRad(20);

				mesh.name = "Back_Options";

				menu_Group.add(mesh);
		});
		scene.add(menu_Group);
    }

	setupGraphics();
    main_Menu();
    level_Select_Menu();
    options_Menu();
	renderFrame();
}