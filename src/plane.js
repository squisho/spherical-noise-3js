import * as THREE from 'three'
import { updateColor } from './utils'

export default class Plane {
    constructor(x, y, z) {
        const material = new THREE.MeshPhongMaterial({
            color: 0x22aa99,
            flatShading: true,
            side: THREE.DoubleSide,
            reflectivity: 100,
            shininess: 1000,
            wireframe: true,
        })

        const geometry = new THREE.PlaneGeometry(800, 800, 40, 40)
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.rotation.x = -0.5 * Math.PI
        this.mesh.position.set(x, y, z)
    }

    setColor = (...a) => updateColor(this.mesh.material, ...a)
}