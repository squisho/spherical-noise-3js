import Extractr from './extractr'
import { createGui } from './gui'
import Ico from './ico'
import ThreeController from './three-controller'
import { modulate, nodulate } from './utils'

const FEATURES = [
  'rms',
  // 'zcr',
  // 'energy',
  'amplitudeSpectrum',
  // 'spectralCentroid',
  'spectralFlatness',
  // 'spectralSlope',
  // 'spectralRolloff',
  // 'spectralSpread',
  // 'spectralSkewness',
  // 'spectralKurtosis',
  // 'chroma',
  'loudness',
  'perceptualSpread',
  'perceptualSharpness',
  // 'mfcc'
]

const noiseConfig = {
  plane: { offset: 0, delta: 'spectralFlatness' },
  ico: { offset: 0, delta: 'spectralFlatness' },
}

let originalVertices
noise.seed(Math.random())

const three = new ThreeController('container')
const materials = three.createMaterials()
const ico = new Ico({ detail: 5, radius: 15 })
three.group.add(ico.mesh)
// let ico = three.createIco({ detail: 5, radius: 10 })
const { topPlane, bottomPlane } = three.createPlanes()
three.scene.add(three.group)
three.createLights()

const gui = createGui(three)
ico.noiseFilter.createControls(gui)

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

  makeRoughGround(topPlane, modulate(stats.upper.avgFr, 0, 1, 5, 25))
  makeRoughGround(bottomPlane, modulate(stats.lower.maxFr, 0, 1, 5, 25))

  const pow = Math.pow(stats.lower.maxFr, 0.8)

  const flatness = ext.getAvg('spectralFlatness') // ext.analyzer.get('spectralFlatness')
  const loudness = ext.getAvg('loudness') // ext.analyzer.get('loudness').total

  const size = nodulate(loudness, 0, 24, 1, 5, 1)
  const roughness = (nodulate(flatness, 0, 1, 1, 2, 1) * size) / 2

  ico.update()
  // makeRoughBall(ico, size, roughness)

  // makeRoughBall(ico, modulate(pow, 0, 1, 0.00001, 10), modulate(upperAvgFr, 0, 1, 1, 10));

  // three.group.rotation.y += 0.002

  const color = [
    ext.getAvg('rms') * 2,
    ext.getAvg('perceptualSpread'),
    ext.getAvg('perceptualSharpness') / 2
  ]

  // three.setIcoColor(color, true)
  three.setPlanesColor(color, true)

  updateLights()

  updateOffsets(ext)
}

function makeRoughBall(mesh, shift, scale) {
  mesh.geometry.vertices.forEach((vertex, i) => {
    const localOffset = mesh.geometry.parameters.radius + shift
    const amp = 7 * scale
    const time = window.performance.now()
    vertex.normalize()
    const rf = s => (time * 0.00001 + noiseConfig.ico.offset) * s

    let distance = localOffset + noise.perlin3(vertex.x + rf(7), vertex.y + rf(8), vertex.z + rf(9)) * amp

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
    const amp = 2 * distortionFr
    const time = Date.now()
    const rf = s => time * s + noiseConfig.plane.offset
    const distance = noise.perlin2(vertex.x + rf(0.0003), vertex.y + rf(0.0001)) * amp
    vertex.z = distance
  })

  mesh.geometry.verticesNeedUpdate = true
  mesh.geometry.normalsNeedUpdate = true
  mesh.geometry.computeVertexNormals()
  mesh.geometry.computeFaceNormals()
}

function updateLights(ext) {
  three.rotateLights()
}

function updateOffsets(ext) {
  const icoDelta = nodulate(ext.getAvg(noiseConfig.ico.delta), 0.0, 1.0, 0.0001, 0.02, 0.0001)
  noiseConfig.ico.offset += icoDelta

  const planeDelta = nodulate(ext.getAvg(noiseConfig.plane.delta), 0.0, 1.0, 0.0, 0.05, 0.00001)
  noiseConfig.plane.offset += planeDelta
}