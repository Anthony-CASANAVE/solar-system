//Creating scene object names.
var pointLight, sun, moon, earth, earthOrbit, ring, controls, scene, renderer, scene;

//Setting the segments every planets and moons will have.
var planetSegments = 48;

//Setting the variables for planets and moons.
var earthData = constructPlanetData(365.2564, 0.015, 25, "earth", "img/earth.jpg", 1, planetSegments);
var moonData = constructPlanetData(29.5, 0.01, 2.8, "moon", "img/moon.jpg", 0.5, planetSegments);

//Set the speed of planets and moons orbits, and if the rotation is activated.
var orbitData = {calue: 200, runOrbit: true, runRotation: true};
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
    myRing.position.set(distanceFromAxis, 0, 0);
    myRing.rotation.x = Math.PI / 2;
    scene.add(myRing);
    return myRing
}

