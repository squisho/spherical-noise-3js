import * as THREE from 'three'
import { updateColor } from './utils'

export default class Plane {
    constructor(x, y, z) {
        const material = new THREE.MeshPhongMaterial({
            color: 0x22aa99,
            flatShading: true,
            side: THREE.DoubleSide,
            reflectivity: 1,
            shininess: 128,
            wireframe: true,
           // emissive: 0x404040,
        })

        const geometry = new THREE.PlaneGeometry(800, 800, 40, 40)
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.rotation.x = -0.5 * Math.PI
        this.mesh.position.set(x, y, z)
    }

    update = () => {
        
        // const localOffset = this.mesh.geometry.parameters.radius // + shift
        // this.mesh.geometry.vertices.forEach(vertex => {
        //     vertex.normalize()
        //     let dist = localOffset + this.noiseFilter.evaluate(vertex)
        //     if (dist < 0.001) dist = 0.001
        //     vertex.multiplyScalar(dist)
        // })

        this.mesh.geometry.verticesNeedUpdate = true
        this.mesh.geometry.normalsNeedUpdate = true
        this.mesh.geometry.computeVertexNormals()
        this.mesh.geometry.computeFaceNormals()
    }

    setColor = (...a) => updateColor(this.mesh.material, ...a)
}