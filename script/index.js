//Creating scene object names.
var pointLight, sun, moon, earth, earthOrbit, ring, controls, scene, renderer, scene;

//Setting the segments every planets and moons will have.
var planetSegments = 32;

//Setting the variables for planets and moons.
var earthData = constructPlanetData(365.2564, 0.015, 25, "earth", "img/earth.jpg", 1, planetSegments);
var moonData = constructPlanetData(29.5, 0.01, 2.8, "moon", "img/moon.jpg", 0.5, planetSegments);

//Set the speed of planets and moons orbits, and if the rotation is activated.
var orbitData = {value: 200, runOrbit: true, runRotation: true};
var clock =new THREE.Clock();

//Planet building function.
function constructPlanetData(myOrbitRate/*decimal*/, myRotationRate/*decimal*/, myDistanceFromAxis/*decimal*/, myName/*string*/, myTexture/*img path*/, mySize/*decimal*/, mySegments/*integer*/) {
    return{
        orbitRate: myOrbitRate,
        rotationRate: myRotationRate,
        distanceFromAxis: myDistanceFromAxis,
        name: myName,
        texture: myTexture,
        size: mySize,
        segments: mySegments
    };
}

//Ring building function and rotation to be horizontal.
function getRing(size/*decimal*/, innerDiameter/*decimal*/, facets/*integer*/, myColor/*html code*/, name/*string*/, distanceFromAxis/*decimal*/) {
    var ring1Geometry = new THREE.RingGeometry(size, innerDiameter, facets);
    var ring1Material = new THREE.MeshBasicMaterial({color: myColor, side: THREE.DoubleSide});
    var myRing = new THREE.Mesh(ring1Geometry, ring1Material);
    myRing.name = name;
    myRing.position.set(distanceFromAxis, 0, 0);
    myRing.rotation.x = Math.PI / 2;
    scene.add(myRing);
    return myRing;
}

//3D ring builder. Heavy in resources, to use only on limited number of rings.
function getTube(size/*decimal*/, innerDiameter/*decimal*/, facets/*integer*/, myColor/*html code*/, name/*string*/, distanceFromAxis/*decimal*/ ) {
    var ringGeometry = new THREE.TorusGeometry(size, innerDiameter, facets, facets);
    var ringMaterial = new THREE.MeshBasicMaterial({color: myColor, side: THREE.DoubleSide});
    myRing = new THREE.Mesh(ringGeometry, ringMaterial);
    myRing.name = name;
    myRing.position.set(distanceFromAxis, 0, 0);
    myRing.rotation.x = Math.PI / 2;
    scene.add(myRing);
    return myRing;
}

function getMaterial(type, color, myTexture) {
    var materialOptions = {
        color : color === undefined ? 'rgb(255, 255, 255)' : color,
        map: myTexture === undefined ? null : myTexture
    };
    switch (type){
        case 'basic':
            return new THREE.MeshBasicMaterial(materialOptions);
        case 'lambert':
            return new THREE.MeshLambertMaterial(materialOptions);
        case 'phong':
            return new THREE.MeshPhongMaterial(materialOptions);
        case 'standard':
            return new THREE.MeshStandardMaterial(materialOptions);
        default:
            return new THREE.MeshBasicMaterial(materialOptions);

    }
}

//Ajouter les planètes ici pour avoir un anneau montrant leur orbite.
function createVisibleOrbits() {
    var orbitWidth = 0.01;
    earthOrbit = getRing(
        earthData.distanceFromAxis + orbitWidth,
        earthData.distanceFromAxis - orbitWidth,
        320,
        0xffff,
        "earthOrbit",
        0
    );
}

//Building a sphere
function getSphere(material, size, segments) {
    var geometry = new THREE.SphereGeometry(size, segments, segments);
    var obj = new THREE.Mesh(geometry, material);
    obj.castShadow = true;

    return obj;
}

function loadTexturedPlanet(myData/*myData from planet builder*/,x, y, z/*xyz -> integers*/, myMaterialType/*myMaterialType string passed to getMaterial*/) {
    var myMaterial;
    var passThisTexture;

    if (myData.texture && myData.texture !==""){
        passThisTexture = new THREE.ImageUtils.loadTexture(myData.texture);
    }
    if (myMaterialType){
        myMaterial = getMaterial(myMaterialType, "rgb(255, 255, 255)", passThisTexture);
    }
    else{
        myMaterial = getMaterial("lambert", "rgb(255, 255, 255)", passThisTexture);
    }

    myMaterial.receiveShadow = true;
    myMaterial.castShadow = true;
    var myPlanet = getSphere(myMaterial, myData.size, myData.segments);
    myPlanet.receiveShadow = true;
    myPlanet.name = myData.name;
    scene.add(myPlanet);
    myPlanet.position.set(x, y, z);

    return myPlanet;
}

function getPointLight(intensity/*Decimal*/, color/*HTML code*/) {
    var light = new THREE.PointLight(color, intensity);
    light.castShadow = true;
    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    return light;
}

//move planet around orbit center and rotate it.
function movePlanet(myPlanet, myData, myTime, stopRotation) {
    if (orbitData.runRotation && !stopRotation){
        myPlanet.rotation.y += myData.rotationRate;
    }
    if (orbitData.runOrbit){
        myPlanet.position.x = Math.cos(myTime
            * (1.0 / (myData.orbitRate * orbitData.value)) + 10.0)
            * myData.distanceFromAxis;
        myPlanet.position.z = Math.sin(myTime
            * (1.0 / (myData.orbitRate * orbitData.value)) + 10.0)
            * myData.distanceFromAxis;
    }
}

//Move moons around its planet and rotate it.
function moveMoon(myMoon, myPlanet, myData, myTime) {
    movePlanet(myMoon, myData, myTime);
    if (orbitData.runOrbit){
        myMoon.position.x = myMoon.position.x + myPlanet.position.x;
        myMoon.position.z = myMoon.position.z + myPlanet.position.z;
    }
}

function update(renderer, scene, camera, controls) {
    pointLight.position.copy(sun.position);
    controls.update();

    var time = Date.now();

    movePlanet(earth, earthData, time);
    movePlanet(ring, earthData, time, true);
    moveMoon(moon, earth, moonData, time);

    renderer.render(scene, camera);
    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    });
}

function init() {
    camera = new THREE.PerspectiveCamera(
        45/*FOV*/,
        window.innerWidth / window.innerHeight/*Setting screen ratio*/,
        1,/*Near clippong for planets*/
        1000/*Far clipping for planets*/
    );
    camera.position.z = 30;
    camera.position.x = -30;
    camera.position.y = 30;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.getElementById('webgl').appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    //Loading background images
    var path = 'img/cubemap/';
    var format = '.jpg';
    var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format,
    ];
    var reflectionCube = new THREE.CubeTextureLoader().load(urls);
    reflectionCube.format = THREE.RGBFormat;

    //Adds the background.
    scene.background = reflectionCube;

    //Makes the sun shine !
    pointLight = getPointLight(1.4, "rgb(255, 240, 220)");
    scene.add(pointLight);

    //Adding some light everywhere.
    var ambiantLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambiantLight);

    //Create the sun !
    var sunMaterial = getMaterial("basic", "rgb(249, 230, 150)");
    sun = getSphere(sunMaterial, 16, 32);
    scene.add(sun);

    //Add the glowing effect around the sun.
    var spriteMaterial = new THREE.SpriteMaterial({
        map: new THREE.ImageUtils.loadTexture("img/glow.png"),
        usScreenCoordinates: false,
        color: 0xffffee,
        transparent: false,
        blending: THREE.AdditiveBlending
        });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(70, 70, 1.0);
    sun.add(sprite);

    earth = loadTexturedPlanet(earthData, earthData.distanceFromAxis, 0, 0);
    moon = loadTexturedPlanet(moonData, moonData.distanceFromAxis, 0, 0);
    ring = getTube(1.8, 0.05, 480, 0x757064, "ring", earthData.distanceFromAxis);

    createVisibleOrbits();

    //Allow camera control
    var gui = new dat.GUI();
    var folder1 = gui.addFolder('light');
    folder1.add(pointLight, 'intensity', 0, 10);
    var folder2 = gui.addFolder('speed');
    folder2.add(orbitData, 'value', 0, 500);
    folder2.add(orbitData, 'runOrbit', 0, 1);
    folder2.add(orbitData, 'runRotation', 0, 1);

    //update the animation and contols
    update(renderer, scene, camera, controls);

}

//Start everything !
init();
