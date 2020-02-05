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
                let feature = config.ranges[curo.mapTo]
                if (curo.mapTo === 'loudness') feature = feature.total

                const newVal = ext.getAvg(curo.mapTo)

                settingsToUpdate[o] = logMap(newVal, feature.min, feature.max, curo.min, curo.max)
            }
        }

        this.updateSettings(settingsToUpdate)
    }

    createControls = gui => {
        gui.add(this.mods.baseRoughness, 'mapTo', config.features).name('baseRoughness').onChange(val => this.mods.baseRoughness['mapTo'] = val)
        gui.add(this.mods.baseRoughness, 'min').min(0).max(10).onChange(val => this.mods.baseRoughness.min = val)
        gui.add(this.mods.baseRoughness, 'max').min(0).max(10).onChange(val => this.mods.baseRoughness.max = val)

        // gui.add(this.mods, 'numLayers', features).onChange(val => this.mods.numLayers = {mapTo: val})
        // gui.add(this.mods.numLayers, 'outmin').min(0).max(10).onChange(val => this.mods.numLayers = {outmin: val})
        // gui.add(this.mods.numLayers, 'outmax').min(0).max(10).onChange(val => this.mods.numLayers = {outmax: val})

        gui.add(this.mods.persistence, 'mapTo', config.features).name('persistence').onChange(val => this.mods.persistence.mapTo = val)
        gui.add(this.mods.persistence, 'min').min(0).max(10).onChange(val => this.mods.persistence.min = val)
        gui.add(this.mods.persistence, 'max').min(0).max(10).onChange(val => this.mods.persistence.max = val)

        gui.add(this.mods.roughness, 'mapTo', config.features).name('roughness').onChange(val => this.mods.roughness.mapTo = val)
        gui.add(this.mods.roughness, 'min').min(0).max(10).onChange(val => this.mods.roughness.min = val)
        gui.add(this.mods.roughness, 'max').min(0).max(10).onChange(val => this.mods.roughness.max = val)

        gui.add(this.mods.speed, 'mapTo', config.features).name('speed').onChange(val => this.mods.speed.mapTo = val)
        gui.add(this.mods.speed, 'min').min(0).max(10).onChange(val => this.mods.speed.min = val)
        gui.add(this.mods.speed, 'max').min(0).max(10).onChange(val => this.mods.speed.max = val)

        gui.add(this.mods.strength, 'mapTo', config.features).name('strength').onChange(val => this.mods.strength.mapTo = val)
        gui.add(this.mods.strength, 'min').min(0).max(10).onChange(val => this.mods.strength.min = val)
        gui.add(this.mods.strength, 'max').min(0).max(10).onChange(val => this.mods.strength.max = val)
    } 
}
