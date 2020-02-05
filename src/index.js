import { Noise } from 'noisejs'

import Extractr from './extractr'
import config from './feature-config'
import { createGui } from './gui'
import Ico from './ico'
import Plane from './plane'
import ThreeController from './three-controller'
import { modulate, nodulate } from './utils'

/** @todo use noise filter for planes */
const noiseConfig = { plane: { offset: 0, delta: 'spectralFlatness' } }
const noise = new Noise(Math.random())
noise.seed(Math.random())

const ext = new Extractr(config.features)

const three = new ThreeController('container')

const ico = new Ico({ detail: 5, radius: 15 })
three.group.add(ico.mesh)

const topPlane = new Plane(0, 30, 0)
const bottomPlane = new Plane(0, -30, 0)
const planes = [topPlane, bottomPlane]
planes.forEach(p => three.group.add(p.mesh))

three.scene.add(three.group)
three.createLights()

const gui = createGui(three)
ico.noiseFilter.createControls(gui.addFolder('ico noise filter'))

main()

async function main() {
  await ext.setup()
  console.log(ext)

  const render = () => {
    requestAnimationFrame(render)
    update()
    three.renderer.render(three.scene, three.camera)
  }

  render()
}

function update() {
  // ico.mesh.rotation.x+=2/100;
  // ico.mesh.rotation.y+=2/100;

  const stats = ext.spectrumStats()
  if (!stats) return

  makeRoughGround(topPlane.mesh, modulate(stats.upper.avgFr, 0, 1, 5, 25))
  makeRoughGround(bottomPlane.mesh, modulate(stats.lower.maxFr, 0, 1, 5, 25))

  ico.update(ext)

  three.group.rotation.y += 0.002

  const color = [
    ext.getAvg('rms') * 2,
    ext.getAvg('perceptualSpread'),
    ext.getAvg('perceptualSharpness') / 2
  ]

  planes.forEach(p => p.setColor(color, true))

  // three.rotateLights()

  updateOffsets()
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

function updateOffsets() {
  const planeDelta = nodulate(ext.getAvg(noiseConfig.plane.delta), 0.0, 1.0, 0.0, 0.05, 0.00001)
  noiseConfig.plane.offset += planeDelta
}
