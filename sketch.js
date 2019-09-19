const EXTRACTORS = [ 'amplitudeSpectrum', 'spectralFlatness', 'loudness', 'spectralKurtosis' ]

const three = new ThreeController('container')
const materials = three.createMaterials()
const ico = three.createIco({ radius: 10, detail: 5 })
const { topPlane, bottomPlane } = three.createPlanes()
three.scene.add(three.group)
three.createLights()

// // Listener
let originalVertices
let offset = 0
noise.seed(Math.random())

setupAnalyzer(EXTRACTORS).then(analyzer => {
  const render = () => {
    requestAnimationFrame(render)
    update(analyzer)
    three.renderer.render(three.scene, three.camera)
  }

  render()
})

function update(analyzer) {
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

  makeRoughGround(three.objects.topPlane, modulate(upperAvgFr, 0, 1, 5, 25));
  makeRoughGround(three.objects.bottomPlane, modulate(lowerMaxFr, 0, 1, 5, 25));

  const pow = Math.pow(lowerMaxFr, 0.8)

  const flatness = analyzer.get('spectralFlatness')
  const loudness = analyzer.get('loudness').total

  const size = noNaN(modulate(loudness, 0, 24, 0.1, 5), 1)
  const roughness = noNaN(modulate(flatness, 0, 1, 1, 2), 1) * size / 2

  makeRoughBall(three.objects.ico, size, roughness)

  // makeRoughBall(ico, modulate(pow, 0, 1, 0.00001, 10), modulate(upperAvgFr, 0, 1, 1, 10));

  three.group.rotation.y += 0.005
  
  let delta = noNaN(modulate(flatness, 0.0, 1.0, 0.0003, 0.03), 0.0003)
  offset += delta // 0.005;
}

function makeRoughBall(mesh, bassFr, treFr) {
  mesh.geometry.vertices.forEach((vertex, i) => {
      const localOffset = mesh.geometry.parameters.radius;
      const amp = 7;
      const time = window.performance.now();
      vertex.normalize();
      const rf = time * 0.00001 + offset;
      let distance = (localOffset + bassFr) + noise.perlin3(
        vertex.x + rf * 7, 
        vertex.y + rf * 8, 
        vertex.z + rf * 9
      ) * amp * treFr;
      if (distance < 0.001) distance = 0.001
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
    const distance = (noise.perlin2(vertex.x + time * 0.0003 + offset, vertex.y + time * 0.0001 + offset) + 0) * distortionFr * amp;
    vertex.z = distance;
  });
  mesh.geometry.verticesNeedUpdate = true;
  mesh.geometry.normalsNeedUpdate = true;
  mesh.geometry.computeVertexNormals();
  mesh.geometry.computeFaceNormals();
}
