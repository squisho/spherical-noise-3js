import { Noise } from 'noisejs'
import * as THREE from 'three'

import config from './feature-config'
import { logMap, nodulate } from './utils'

const noise = new Noise(Math.random())

export default class NoiseFilter {
    constructor() {
        this.settings = {
            baseRoughness: 1,
            center: new THREE.Vector3(0, 0, 0),
            numLayers: 2,
            persistence: 0.15,
            roughness: 5,
            speed: 0.001,
            strength: 2,
        }
        this.mods = {
            baseRoughness: {
                def: 2,
                min: 0,
                max: 2,
                mapTo: 'perceptualSharpness',
            },
            numLayers: {
                def: 2,
                min: 0,
                max: 5,
                mapTo: false,
            },
            persistence: {
                def: 0.15,
                min: 0,
                max: 1,
                mapTo: 'energy',
            },
            roughness: {
                def: 5,
                min: 1,
                max: 20,
                mapTo: 'spectralFlatness',
            },
            speed: {
                def: 0.001,
                min: 0,
                max: 0.015,
                mapTo: false,
            },
            strength: {
                def: 2,
                min: 1,
                max: 15,
                mapTo: 'loudness',
            },
        }
    }

    evaluate = p => {
        let noiseValue = 0
        let frequency = this.settings.baseRoughness
        let amplitude = this.settings.strength // 1

        for (let i = 0; i < this.settings.numLayers; i++) {
            const offset = window.performance.now() * this.settings.speed
            const point = p.clone().multiplyScalar(frequency).add(this.settings.center).addScalar(offset)
            const v = noise.perlin3(point.x, point.y, point.z) * amplitude

            noiseValue += v
            frequency *= this.settings.roughness
            amplitude *= this.settings.persistence
        }

        return noiseValue
    }

    updateSettings = newSettings => {
        this.settings = { ...this.settings, ...newSettings }
    }

    updateCenter = ({x, y, z}) => {
        if (x) this.settings.center.x = x 
        if (y) this.settings.center.y = y 
        if (z) this.settings.cetner.z = z
    }

    update = ext => {
        const settingsToUpdate = {}

        for (let o in this.mods) {
            const curo = this.mods[o]

            if (curo.mapTo) {
                let newVal
                let feature = config.ranges[curo.mapTo]

                if (curo.mapTo == 'loudness') {
                    newVal = ext.getAvg('loudness', loudness => loudness.total)
                    feature = feature.total
                } else {
                    newVal = ext.getAvg(curo.mapTo)
                }
                
                let outVal = logMap(newVal, feature.min, feature.max, curo.min, curo.max)

                settingsToUpdate[o] = outVal;
            }
        }

        this.updateSettings(settingsToUpdate)
    }

    createControls = gui => {
         const folder = gui.addFolder('Noise')
        // folder.add(this.settings, 'baseRoughness').min(-5).max(5).onChange(val => this.updateSettings({ baseRoughness: val }))
        // folder.add(this.settings, 'numLayers').min(0).max(10).step(1).onChange(val => this.updateSettings({ numLayers: val }))
        // folder.add(this.settings, 'persistence').min(0).max(1).onChange(val => this.updateSettings({ peristence: val }))
        // folder.add(this.settings, 'roughness').min(-5).max(5).onChange(val => this.updateSettings({ roughness: val }))
        // folder.add(this.settings, 'speed').min(0).max(0.0025).onChange(val => this.updateSettings({ speed: val }))
        // folder.add(this.settings, 'strength').min(1).max(40).onChange(val => this.updateSettings({ strength: val }))
        folder.add({ centerX: 0 }, 'centerX').min(-10).max(10).onChange(x => this.updateCenter({ x }))
        folder.add({ centerY: 0 }, 'centerY').min(-10).max(10).onChange(y => this.updateCenter({ y }))
        folder.add({ centerZ: 0 }, 'centerZ').min(-10).max(10).onChange(z => this.updateCenter({ z }))

        const f2 = gui.addFolder('Extrctr')
        f2.add(this.mods.baseRoughness, 'mapTo', config.features).name('baseRoughness').onChange(val => this.mods.baseRoughness['mapTo'] = val)
        f2.add(this.mods.baseRoughness, 'min').min(0).max(10).onChange(val => this.mods.baseRoughness.min = val)
        f2.add(this.mods.baseRoughness, 'max').min(0).max(10).onChange(val => this.mods.baseRoughness.max = val)

        // f2.add(this.mods, 'numLayers', features).onChange(val => this.mods.numLayers = {mapTo: val})
        // f2.add(this.mods.numLayers, 'outmin').min(0).max(10).onChange(val => this.mods.numLayers = {outmin: val})
        // f2.add(this.mods.numLayers, 'outmax').min(0).max(10).onChange(val => this.mods.numLayers = {outmax: val})

        f2.add(this.mods.persistence, 'mapTo', config.features).name('persistence').onChange(val => this.mods.persistence.mapTo = val)
        f2.add(this.mods.persistence, 'min').min(0).max(10).onChange(val => this.mods.persistence.min = val)
        f2.add(this.mods.persistence, 'max').min(0).max(10).onChange(val => this.mods.persistence.max = val)

        f2.add(this.mods.roughness, 'mapTo', config.features).name('roughness').onChange(val => this.mods.roughness.mapTo = val)
        f2.add(this.mods.roughness, 'min').min(0).max(10).onChange(val => this.mods.roughness.min = val)
        f2.add(this.mods.roughness, 'max').min(0).max(10).onChange(val => this.mods.roughness.max = val)

        f2.add(this.mods.speed, 'mapTo', config.features).name('speed').onChange(val => this.mods.speed.mapTo = val)
        f2.add(this.mods.speed, 'min').min(0).max(10).onChange(val => this.mods.speed.min = val)
        f2.add(this.mods.speed, 'max').min(0).max(10).onChange(val => this.mods.speed.max = val)

        f2.add(this.mods.strength, 'mapTo', config.features).name('strength').onChange(val => this.mods.strength.mapTo = val)
        f2.add(this.mods.strength, 'min').min(0).max(10).onChange(val => this.mods.strength.min = val)
        f2.add(this.mods.strength, 'max').min(0).max(10).onChange(val => this.mods.strength.max = val)

        f2.open()
    } 
}
