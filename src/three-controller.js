import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'

import { updateColor } from './utils'

export default class ThreeController {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.scene = new THREE.Scene()
    this.group = new THREE.Group()
    this.clock = new THREE.Clock()

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.container.append(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(67.5, window.innerWidth / window.innerHeight, 0.5, 10000)
    this.camera.lookAt(this.scene.position)
    this.scene.add(this.camera)

    this.camera.position.z = 75

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    window.addEventListener('resize', this.onWindowResize, false);

    this.objects = {}
    this.lights = {}
  }

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  removeObject = object => {
    const selectedObject = this.scene.getObjectByName(object.name);
    this.scene.remove(selectedObject);
  }

  createLights = () => {
    const lights = {}

    lights.ambient = new THREE.AmbientLight(0xaaaaaa)
    this.scene.add(lights.ambient)

    lights.spot = new THREE.SpotLight(0xffffff)
    lights.spot.intensity = 0.3
    lights.spot.position.set(-10, 40, 20)
    lights.spot.castShadow = true
    this.scene.add(lights.spot)

    // const sphere = new THREE.SphereBufferGeometry(1, 16, 8)

    lights.rotating = [0xff0040, 0x0040ff, 0x80ff80, 0xffaa00].map(color => {
      const light = new THREE.PointLight(color, 0.5, 50)
      // light.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color } )))
      this.scene.add(light)
      return light
    })

    this.lights = lights

    return this.lights
  }

  rotateLights = () => {
    const time = Date.now() * 0.0005
    const delta = this.clock.getDelta()

    this.lights.rotating[0].position.y = Math.cos(time * 0.5) * 40
    this.lights.rotating[0].position.z = Math.cos(time * 0.3) * 30
    this.lights.rotating[0].position.x = Math.sin(time * 0.7) * 30

    this.lights.rotating[1].position.x = Math.cos(time * 0.3) * 30
    this.lights.rotating[1].position.y = Math.sin(time * 0.5) * 40
    this.lights.rotating[1].position.z = Math.sin(time * 0.7) * 30

    this.lights.rotating[2].position.x = Math.sin(time * 0.7) * 30
    this.lights.rotating[2].position.y = Math.cos(time * 0.3) * 40
    this.lights.rotating[2].position.z = Math.sin(time * 0.5) * 30

    this.lights.rotating[3].position.x = Math.sin(time * 0.3) * 30
    this.lights.rotating[3].position.y = Math.cos(time * 0.7) * 40
    this.lights.rotating[3].position.z = Math.sin(time * 0.5) * 30
  }

  setAmbientLightColor = (...a) => updateColor(this.lights.ambient, ...a)

  setSpotLightColor = (...a) => updateColor(this.lights.spot, ...a)

  updateRLight = i => (...a) => updateColor(this.lights.rotating[i], ...a)
}
