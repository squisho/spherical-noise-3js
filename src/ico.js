import * as THREE from 'three'

import NoiseFilter from './noise-filter'

export default class Ico {
    constructor({ radius, detail }) {
        const material = new THREE.MeshPhongMaterial({
            color: 0xaa90dd,
            reflectivity:  100,
            // flatShading: true,
            // wireframe: true,
        })

        this.mesh = new THREE.Mesh(this.createIcoGeometry(radius, detail), material)
        this.mesh.rotation.z = 0.5
        this.mesh.name = 'sphere'
        this.mesh.castShadow = true

        this.noiseFilter = new NoiseFilter()
    }

    createIcoGeometry = (radius, detail) => new THREE.IcosahedronGeometry(radius, detail)

    setDetail = detail => {
        const old = this.mesh.geometry 
        this.mesh.geometry = this.createIcoGeometry(10, detail)
        old.dispose()
    }

    setColor = (...a) => updateColor(this.mesh.material, ...a)

    update = () => {
        // console.log(this.noiseFilter.settings)
        const localOffset = this.mesh.geometry.parameters.radius // + shift
        this.mesh.geometry.vertices.forEach(vertex => {
            vertex.normalize()
            let dist = localOffset + this.noiseFilter.evaluate(vertex)
            if (dist < 0.001) dist = 0.001
            vertex.multiplyScalar(dist)
        })

        this.mesh.geometry.verticesNeedUpdate = true
        this.mesh.geometry.normalsNeedUpdate = true
        this.mesh.geometry.computeVertexNormals()
        this.mesh.geometry.computeFaceNormals()
    }
}