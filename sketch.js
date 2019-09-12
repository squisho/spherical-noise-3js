const three = new ThreeController('container')

// Materials
const mat = new THREE.MeshLambertMaterial({
  color      :  0xaa90dd,
  wireframe  :  true,
  // emissive   :  new THREE.Color("rgb(255,255,255)"),
  // specular   :  new THREE.Color("rgb(255,255,255)"),
  // shininess  :  10,
  // // shading    :  THREE.FlatShading,
  // transparent: 1,
  // opacity    : 1
});

const planeMat = new THREE.MeshLambertMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  wireframe: true,
});
const planeGeometry = new THREE.PlaneGeometry(800, 800, 40, 40);

// IcoSphere -> THREE.IcosahedronGeometry(80, 1) 1-4
const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(10,4), mat);
ico.rotation.z = 0.5;
group.add(ico);

// Planes
const plane = new THREE.Mesh(planeGeometry, planeMat);
plane.rotation.x = -0.5 * Math.PI;
plane.position.set(0, 30, 0);
group.add(plane);

const plane2 = new THREE.Mesh(planeGeometry, planeMat);
plane2.rotation.x = -0.5 * Math.PI;
plane2.position.set(0, -30, 0);
group.add(plane2);

scene.add(group);


// Lights

const ambientLight = new THREE.AmbientLight(0xaaaaaa);
  scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.intensity = 0.9;
  spotLight.position.set(-10, 40, 20);
  spotLight.lookAt(ico);
  spotLight.castShadow = true;
  scene.add(spotLight);

// // Listener
// const listener = new THREE.AudioListener();
// camera.add(listener);
// //
// // create global audio source
// const audio = new THREE.Audio( listener );
const bufferSize = 256;
let analyzer;
//
// Init mic input
navigator.mediaDevices.getUserMedia( { audio: true, video: false } ).then( handleSuccess );

function handleSuccess( stream ) {
  if (!analyzer) initAnalyzer(stream);
}

function initAnalyzer(stream){

    const audioContext = new AudioContext();
    // set audio source to input stream from microphone (Web Audio API https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioSourceNode)
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(audioContext.destination);

  analyzer = Meyda.createMeydaAnalyzer({
   "audioContext": audioContext,
   "source": source,
   "bufferSize": bufferSize,
   "featureExtractors": ["rms", "energy"],
   "callback": features => {
   }
  });
  analyzer.start();

}

noise.seed(Math.random());

let originalVertices;
let offset = 0;

const f = n => n * 2 + offset;

function getSoundData(soundData){
  return {
    "rms": analyzer.get('rms'),
    "energy": analyzer.get('energy')};
}

function update(){
   // ico.rotation.x+=2/100;
   // ico.rotation.y+=2/100;
   let soundData;
   if (analyzer) soundData = getSoundData(soundData);
   console.log(soundData);

   if (!originalVertices) originalVertices = ico.geometry.vertices;
   ico.geometry.vertices.forEach((vertex, i) => {
     const p = vertex.normalize();
     const r = noise.perlin3(f(p.x), f(p.y), f(p.z)) * 4 + 20;
     p.multiplyScalar(r);
   });
   ico.geometry.verticesNeedUpdate = true;

   group.rotation.y += 0.0001;

   offset += 0.005;
}

// Render
function render() {
  requestAnimationFrame(render);
  makeRoughGround(plane, 5);
  makeRoughGround(plane2, 5);
  update();
  renderer.render(scene, camera);
}

render();


function makeRoughGround(mesh, distortionFr) {
    mesh.geometry.vertices.forEach(function (vertex, i) {
        const amp = 2;
        const time = Date.now();
        const distance = (noise.perlin3(vertex.x + time * 0.0003, vertex.y + time * 0.0001, time * 0.0001) + 0) * distortionFr * amp;
        vertex.z = distance;
    });
    mesh.geometry.verticesNeedUpdate = true;
    mesh.geometry.normalsNeedUpdate = true;
    mesh.geometry.computeVertexNormals();
    mesh.geometry.computeFaceNormals();
}
