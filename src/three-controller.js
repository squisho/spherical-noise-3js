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

        window.addEventListener('resize', this.onWindowResize, false)

        this.objects = {}
        this.lights = {}
    }

    onWindowResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    removeObject = (object) => {
        const selectedObject = this.scene.getObjectByName(object.name)
        this.scene.remove(selectedObject)
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

        var sphere = new THREE.SphereBufferGeometry(0.5, 8, 16)

        lights.orb1 = new THREE.PointLight(0xff0040, 1, 50)
        lights.orb1.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xff0040 })))
        this.scene.add(lights.orb1)

        lights.orb2 = new THREE.PointLight(0x0040ff, 1, 50)
        lights.orb2.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0x0040ff })))
        this.scene.add(lights.orb2)

        lights.orb3 = new THREE.PointLight(0xeeee00, 1, 50)
        lights.orb3.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xeeee00 })))
        this.scene.add(lights.orb3)

        this.lights = lights

        return this.lights
    }

    rotateLights = () => {
        const time = Date.now() * 0.0005

        this.lights.orb1.position.y = Math.sin(time * 0.7) * 30
        this.lights.orb1.position.z = Math.cos(time * 0.5) * 40
        this.lights.orb1.position.x = Math.cos(time * 0.3) * 30

        this.lights.orb2.position.y = Math.cos(time * 0.3) * 30
        this.lights.orb2.position.z = Math.sin(time * 0.5) * 40
        this.lights.orb2.position.x = Math.sin(time * 0.7) * 30

        this.lights.orb3.position.y = Math.sin(time * 0.7) * 30
        this.lights.orb3.position.z = Math.cos(time * 0.3) * 40
        this.lights.orb3.position.x = Math.sin(time * 0.5) * 30
    }

    setAmbientLightColor = (...a) => updateColor(this.lights.ambient, ...a)

    setSpotLightColor = (...a) => updateColor(this.lights.spot, ...a)

    updateRLight = (i) => (...a) => updateColor(this.lights.rotating[i], ...a)
}
