import { Noise } from 'noisejs'
import * as THREE from 'three'

import config from './feature-config'
import { logMap } from './utils'

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
                min: 1,
                max: 6,
                mapTo: 'energy',
            },
            numLayers: {
                def: 2,
                min: 0,
                max: 3,
                mapTo: 'rms',
            },
            persistence: {
                def: 0.15,
                min: 0,
                max: 1,
                mapTo: 'perceptualSpread',
            },
            roughness: {
                def: 5,
                min: 1,
                max: 10,
                mapTo: 'spectralFlatness',
            },
            speed: {
                def: 0.0001,
                min: 0.0001,
                max: 0.001,
                mapTo: null,
            },
            strength: {
                def: 2,
                min: 0,
                max: 15,
                mapTo: 'perceptualSharpness',
            },
        }
    }

    evaluate = (p) => {
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

    updateSettings = (newSettings) => {
        this.settings = { ...this.settings, ...newSettings }
    }

    updateCenter = ({ x, y, z }) => {
        if (x) this.settings.center.x = x
        if (y) this.settings.center.y = y
        if (z) this.settings.cetner.z = z
    }

    update = (ext) => {
        const settingsToUpdate = {}

        this.mods.forEach((curo, o) => {
            if (curo.mapTo) {
                let feature = config.ranges[curo.mapTo]
                if (curo.mapTo === 'loudness') feature = feature.total

                const newVal = ext.getAvg(curo.mapTo)

                settingsToUpdate[o] = logMap(newVal, feature.min, feature.max, curo.min, curo.max)
            }
        })

        this.updateSettings(settingsToUpdate)
    }

    createControls = (gui) => {
        const folder = gui.addFolder('noise filter')

        folder
            .add(this.mods.baseRoughness, 'mapTo', config.features)
            .name('baseRoughness')
            .onChange((val) => {
                this.mods.baseRoughness.mapTo = val
            })
        folder
            .add(this.mods.baseRoughness, 'min')
            .min(0)
            .max(10)
            .onChange((val) => {
                this.mods.baseRoughness.min = val
            })
        folder
            .add(this.mods.baseRoughness, 'max')
            .min(0)
            .max(10)
            .onChange((val) => {
                this.mods.baseRoughness.max = val
            })

        folder
            .add(this.mods.numLayers, 'mapTo', config.features)
            .name('numLayers')
            .onChange((val) => {
                this.mods.numLayers.mapTo = val
            })
        folder
            .add(this.mods.numLayers, 'min')
            .min(0)
            .max(10)
            .onChange((val) => {
                this.mods.numLayers.min = val
            })
        folder
            .add(this.mods.numLayers, 'max')
            .min(0)
            .max(10)
            .onChange((val) => {
                this.mods.numLayers.max = val
            })

        folder
            .add(this.mods.persistence, 'mapTo', config.features)
            .name('persistence')
            .onChange((val) => {
                this.mods.persistence.mapTo = val
            })
        folder
            .add(this.mods.persistence, 'min')
            .min(0)
            .max(10)
            .onChange((val) => {
                this.mods.persistence.min = val
            })
        folder
            .add(this.mods.persistence, 'max')
            .min(0)
            .max(10)
            .onChange((val) => {
                this.mods.persistence.max = val
            })

        folder
            .add(this.mods.roughness, 'mapTo', config.features)
            .name('roughness')
            .onChange((val) => {
                this.mods.roughness.mapTo = val
            })
        folder
            .add(this.mods.roughness, 'min')
            .min(0)
            .max(10)
            .onChange((val) => {
                this.mods.roughness.min = val
            })
        folder
            .add(this.mods.roughness, 'max')
            .min(0)
            .max(10)
            .onChange((val) => {
                this.mods.roughness.max = val
            })

        // folder.add(this.mods.speed, 'mapTo', config.features).name('speed').onChange(val => this.mods.speed.mapTo = val)
        // folder.add(this.mods.speed, 'min').min(0).max(10).onChange(val => this.mods.speed.min = val)
        // folder.add(this.mods.speed, 'max').min(0).max(10).onChange(val => this.mods.speed.max = val)

        folder
            .add(this.mods.strength, 'mapTo', config.features)
            .name('strength')
            .onChange((val) => {
                this.mods.strength.mapTo = val
            })
        folder
            .add(this.mods.strength, 'min')
            .min(0)
            .max(10)
            .onChange((val) => {
                this.mods.strength.min = val
            })
        folder
            .add(this.mods.strength, 'max')
            .min(0)
            .max(10)
            .onChange((val) => {
                this.mods.strength.max = val
            })
    }
}
