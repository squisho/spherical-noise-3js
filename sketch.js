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
three.group.add(ico); 



// Planes
const plane = new THREE.Mesh(planeGeometry, planeMat);
plane.rotation.x = -0.5 * Math.PI;
plane.position.set(0, 30, 0);
three.group.add(plane);

const plane2 = new THREE.Mesh(planeGeometry, planeMat);
plane2.rotation.x = -0.5 * Math.PI;
plane2.position.set(0, -30, 0);
three.group.add(plane2);

three.scene.add(three.group);



// Lights

const ambientLight = new THREE.AmbientLight(0xaaaaaa);
three.scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff);
spotLight.intensity = 0.9;
spotLight.position.set(-10, 40, 20);
spotLight.castShadow = true;
three.scene.add(spotLight);



// // Listener
const bufferSize = 256;
let analyzer;

// The navigator object contains information about the browser.
// this async call initializes audio input from the user
navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
  if (!analyzer) initAnalyzer(stream)
})


function initAnalyzer(stream) {
  const audioContext = new AudioContext();
  // set audio source to input stream from microphone (Web Audio API https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioSourceNode)
  const source = audioContext.createMediaStreamSource(stream);

  analyzer = Meyda.createMeydaAnalyzer({
    audioContext: audioContext,
    source: source,
    bufferSize: bufferSize,
    featureExtractors: [ 'amplitudeSpectrum' ], // ["rms", "energy"],
    callback: features => null
  });
  analyzer.start();
}

noise.seed(Math.random());

let originalVertices;
let offset = 0;

function getSoundData(soundData) {
  return {
    "rms": analyzer.get('rms'),
    "energy": analyzer.get('energy')
  };
}

function update() {
  if (!analyzer) return

  // ico.rotation.x+=2/100;
  // ico.rotation.y+=2/100;
  
  const soundData = analyzer.get('amplitudeSpectrum');
  if (!soundData) return
  
  const lowerHalfArray = soundData.slice(0, soundData.length / 2 - 1)
  const upperHalfArray = soundData.slice(soundData.length / 2, soundData.length - 1)

  const overallAvg  = avg(soundData)
  const lowerMax    = max(lowerHalfArray)
  const lowerAvg    = avg(lowerHalfArray)
  const upperMax    = max(upperHalfArray)
  const upperAvg    = avg(upperHalfArray)

  const lowerMaxFr = lowerMax / lowerHalfArray.length
  const lowerAvgFr = lowerAvg / lowerHalfArray.length
  const upperMaxFr = upperMax / upperHalfArray.length
  const upperAvgFr = upperAvg / upperHalfArray.length

  makeRoughGround(plane, modulate(upperAvgFr, 0, 1, 5, 25));
  makeRoughGround(plane2, modulate(lowerMaxFr, 0, 1, 5, 25));

  const pow = Math.pow(lowerMaxFr, 0.8)

  makeRoughBall(ico, modulate(pow, 0, 1, 1, 9), modulate(upperAvgFr, 0, 1, 1, 25));

  three.group.rotation.y += 0.005
  offset += 0.005;
}

// function update() {
//   // ico.rotation.x+=2/100;
//   // ico.rotation.y+=2/100;
//   let soundData;
//   if (analyzer) soundData = getSoundData(soundData);

//   if (!originalVertices) originalVertices = ico.geometry.vertices;

//   const f = n => n * 2 + offset;

//   ico.geometry.vertices.forEach((vertex, i) => {
//     const p = vertex.normalize();
//     const r = noise.perlin3(f(p.x), f(p.y), f(p.z)) * 4 + 20;
//     p.multiplyScalar(r);
//   });

//   ico.geometry.verticesNeedUpdate = true;

//   three.group.rotation.y += 0.0001;

//   offset += 0.005;
// }

// Render
function render() {
  requestAnimationFrame(render);
  // makeRoughGround(plane, 5);
  // makeRoughGround(plane2, 5);
  update();
  three.renderer.render(three.scene, three.camera);
}

render();


function makeRoughBall(mesh, bassFr, treFr) {
  mesh.geometry.vertices.forEach((vertex, i) => {
      const offset = mesh.geometry.parameters.radius;
      const amp = 7;
      const time = window.performance.now();
      vertex.normalize();
      const rf = time * 0.00001;
      const distance = (offset + bassFr) + noise.perlin3(
        vertex.x + rf * 7, 
        vertex.y + rf * 8, 
        vertex.z + rf * 9
      ) * amp * treFr;
      vertex.multiplyScalar(distance);
  });
  mesh.geometry.verticesNeedUpdate = true;
  mesh.geometry.normalsNeedUpdate = true;
  mesh.geometry.computeVertexNormals();
  mesh.geometry.computeFaceNormals();
}


function makeRoughGround(mesh, distortionFr) {
  mesh.geometry.vertices.forEach(function (vertex, i) {
    const amp = 2;
    const time = Date.now();
    const distance = (noise.perlin2(vertex.x + time * 0.0003, vertex.y + time * 0.0001) + 0) * distortionFr * amp;
    vertex.z = distance;
  });
  mesh.geometry.verticesNeedUpdate = true;
  mesh.geometry.normalsNeedUpdate = true;
  mesh.geometry.computeVertexNormals();
  mesh.geometry.computeFaceNormals();
}
