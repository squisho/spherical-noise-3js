const FEATURES = ['amplitudeSpectrum', 'spectralFlatness', 'loudness', 'spectralKurtosis']

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

main()

async function main() {
  const ext = new Extractr(FEATURES)
  await ext.setup()

  const render = () => {
    requestAnimationFrame(render)
    update(ext)
    three.renderer.render(three.scene, three.camera)
  }

  render()
}

function update(ext) {
  // ico.rotation.x+=2/100;
  // ico.rotation.y+=2/100;

  const stats = ext.spectrumStats()
  if (!stats) return

  makeRoughGround(three.objects.topPlane, modulate(stats.upper.avgFr, 0, 1, 5, 25))
  makeRoughGround(three.objects.bottomPlane, modulate(stats.lower.maxFr, 0, 1, 5, 25))

  const pow = Math.pow(stats.lower.maxFr, 0.8)

  const flatness = ext.getAvg('spectralFlatness') // ext.analyzer.get('spectralFlatness')
  const loudness = ext.getAvg('loudness') // ext.analyzer.get('loudness').total

  const size = nodulate(loudness, 0, 24, 1, 5, 1)
  const roughness = (nodulate(flatness, 0, 1, 1, 2, 1) * size) / 2

  makeRoughBall(three.objects.ico, size, roughness)

  // makeRoughBall(ico, modulate(pow, 0, 1, 0.00001, 10), modulate(upperAvgFr, 0, 1, 1, 10));

  three.group.rotation.y += 0.005

  let delta = nodulate(flatness, 0.0, 1.0, 0.002, 0.01, 0.001)
  offset += delta // 0.005;

  updateLights()
}

function makeRoughBall(mesh, shift, scale) {
  mesh.geometry.vertices.forEach((vertex, i) => {
    const localOffset = mesh.geometry.parameters.radius
    const amp = 7
    const time = window.performance.now()
    vertex.normalize()
    const rf = time * 0.00001 + offset

    let distance =
      localOffset + shift + noise.perlin3(vertex.x + rf * 7, vertex.y + rf * 8, vertex.z + rf * 9) * amp * scale

    if (distance < 0.001) distance = 0.001
    vertex.multiplyScalar(distance)
  })

  mesh.geometry.verticesNeedUpdate = true
  mesh.geometry.normalsNeedUpdate = true
  mesh.geometry.computeVertexNormals()
  mesh.geometry.computeFaceNormals()
}

function makeRoughGround(mesh, distortionFr) {
  mesh.geometry.vertices.forEach(function(vertex, i) {
    const amp = 2
    const time = Date.now()
    const distance =
      (noise.perlin2(vertex.x + time * 0.0003 + offset, vertex.y + time * 0.0001 + offset) + 0) * distortionFr * amp
    vertex.z = distance
  })

  mesh.geometry.verticesNeedUpdate = true
  mesh.geometry.normalsNeedUpdate = true
  mesh.geometry.computeVertexNormals()
  mesh.geometry.computeFaceNormals()
}

function updateLights() {
  const time = Date.now() * 0.0005;
  const delta = three.clock.getDelta();

  three.lights.rotating[0].position.x = Math.sin(time * 0.7) * 30;
  three.lights.rotating[0].position.y = Math.cos(time * 0.5) * 40;
  three.lights.rotating[0].position.z = Math.cos(time * 0.3) * 30;
  
  three.lights.rotating[1].position.x = Math.cos(time * 0.3) * 30;
  three.lights.rotating[1].position.y = Math.sin(time * 0.5) * 40;
  three.lights.rotating[1].position.z = Math.sin(time * 0.7) * 30;
  
  three.lights.rotating[2].position.x = Math.sin(time * 0.7) * 30;
  three.lights.rotating[2].position.y = Math.cos(time * 0.3) * 40;
  three.lights.rotating[2].position.z = Math.sin(time * 0.5) * 30;
  
  three.lights.rotating[3].position.x = Math.sin(time * 0.3) * 30;
  three.lights.rotating[3].position.y = Math.cos(time * 0.7) * 40;
  three.lights.rotating[3].position.z = Math.sin(time * 0.5) * 30;
}