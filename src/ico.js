import * as THREE from 'three'

import NoiseFilter from './noise-filter'
import { modulate, updateColor } from './utils'

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

        this.offset = 0
    }

    createIcoGeometry = (radius, detail) => new THREE.IcosahedronGeometry(radius, detail)

    createControls = gui => {
        const folder = gui.addFolder('ico')

        folder.add({ detail: 5 }, 'detail').name('detail').min(0).max(5).step(1).onChange(this.setDetail)

        this.noiseFilter.createControls(folder)
    }

    setDetail = detail => {
        const old = this.mesh.geometry 
        this.mesh.geometry = this.createIcoGeometry(10, detail)
        old.dispose()
    }

    setColor = (...a) => updateColor(this.mesh.material, ...a)

    update = (extractr) => {
        this.noiseFilter.update(extractr)

        const minRadius = 1
        const localOffset = this.mesh.geometry.parameters.radius // + shift
        this.mesh.geometry.vertices.forEach(vertex => {
            vertex.normalize()
            let dist = localOffset + this.noiseFilter.evaluate(vertex)
            if (dist < minRadius) dist = minRadius
            vertex.multiplyScalar(dist)
        })

        this.soundToColor(extractr)

        this.mesh.geometry.verticesNeedUpdate = true
        this.mesh.geometry.normalsNeedUpdate = true
        this.mesh.geometry.computeVertexNormals()
        this.mesh.geometry.computeFaceNormals()
    }

    soundToColor = ext => {
        const chroma = ext.analyzer.get('chroma')
        const maxIndex = chroma.indexOf(1)
        const hue = modulate(maxIndex, 0, 12, 0, 360) + this.offset
        const newColor = new THREE.Color(`hsl(${hue % 360}, 50%, 50%)`)
        const lerped = this.mesh.material.color.lerpHSL(newColor, 0.05)
        this.setColor(lerped)

        this.offset += 0.05
    }
}
