import { Noise } from 'noisejs'
import * as THREE from 'three'

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
            baseRoughness: 
            {   def: 2,
                outmin: 0,
                outmax: 2,
                mapTo: 'perceptualSharpness',
                rmin: 0,
                rmax: 1
            },
            numLayers: 
            {   def: 2,
                outmin: 0,
                outmax: 5,
                mapTo: false,
                rmin: undefined,
                rmax: undefined
            },
            persistence:
            {   def: 0.15,
                outmin: 0,
                outmax: 1,
                mapTo: 'energy',
                rmin: 0,
                rmax: 512
            },
            roughness:
            {   def: 5,
                outmin: 1,
                outmax: 20,
                mapTo: 'spectralFlatness',
                rmin: 0,
                rmax: 1
            },
            speed: 
            {   def: 0.001,
                outmin: 0,
                outmax: 5,
                mapTo: false,
                rmin: undefined,
                rmax: undefined
            },
            strength:
            {   def: 2,
                outmin: 1,
                outmax: 15,
                mapTo: 'loudness',
                rmin: 0,
                rmax: 24
            },
        }

    }

    evaluate = p => {
        let noiseValue = 0
        let frequency = this.settings.baseRoughness
        let amplitude = this.settings.strength // 1

        // cuz im a brat ;)
        new Array(this.settings.numLayers).fill(null).forEach((_, i) => {
            const point = p.clone().multiplyScalar(frequency).add(this.settings.center).addScalar(window.performance.now() * this.settings.speed)
            const v = noise.perlin3(point.x, point.y, point.z) * amplitude
            noiseValue += v
            frequency *= this.settings.roughness
            amplitude *= this.settings.persistence
        })

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

        var settingsToUpdate = {}

        for (var o in this.mods){
            var curo = this.mods[o]
            if (curo.mapTo){
                var newVal
                if (curo.mapTo == 'loudness') newVal = ext.getAvg('loudness', loudness => loudness.total);
                else newVal = ext.getAvg(`${curo.mapTo}`)
                //console.log(curo.rmin, curo.rmax)
                var outVal = logMap(newVal, curo.rmin, curo.rmax, curo.outmin, curo.outmax)

                settingsToUpdate[o] = outVal;
            }
        }
        // const loudness = ext.getAvg('loudness', loudness => loudness.total)
        // const strength = logMap(loudness, 0, 24, 1, 15)

        // const sharpness = ext.getAvg('perceptualSharpness')
        // const baseRoughness = logMap(sharpness, 0, 1, 0, 2)

        // const flatness = ext.getAvg('spectralFlatness')
        // const roughness = logMap(flatness, 0, 1, 1, 20)

        // const energy = ext.getAvg('energy')
        // const persistence = logMap(energy, 0, 512, 0, 1)
        // console.log({ baseRoughness, persistence, roughness, strength })
        // this.updateSettings({ baseRoughness, persistence, roughness, strength })
        console.log(this.mods)
        console.log(settingsToUpdate)
        this.updateSettings(settingsToUpdate)
    }

    createControls = gui => {
    
        
        const folder = gui.addFolder('Noise')
        folder.add(this.settings, 'baseRoughness').min(-5).max(5).onChange(val => this.updateSettings({ baseRoughness: val }))
        folder.add(this.settings, 'numLayers').min(0).max(10).step(1).onChange(val => this.updateSettings({ numLayers: val }))
        folder.add(this.settings, 'persistence').min(0).max(1).onChange(val => this.updateSettings({ peristence: val }))
        folder.add(this.settings, 'roughness').min(-5).max(5).onChange(val => this.updateSettings({ roughness: val }))
        folder.add(this.settings, 'speed').min(0).max(0.0025).onChange(val => this.updateSettings({ speed: val }))
        folder.add(this.settings, 'strength').min(1).max(40).onChange(val => this.updateSettings({ strength: val }))
        folder.add({ centerX: 0 }, 'centerX').min(-10).max(10).onChange(x => this.updateCenter({ x }))
        folder.add({ centerY: 0 }, 'centerY').min(-10).max(10).onChange(y => this.updateCenter({ y }))
        folder.add({ centerZ: 0 }, 'centerZ').min(-10).max(10).onChange(z => this.updateCenter({ z }))



        const features = [
            'rms',
            'zcr',
            'energy',
           // 'amplitudeSpectrum',
            'spectralCentroid',
            'spectralFlatness',
            'spectralSlope',
            'spectralRolloff',
            'spectralSpread',
            'spectralSkewness',
            'spectralKurtosis',
            //'chroma',
            'loudness',
            'perceptualSpread',
            'perceptualSharpness',
           // 'mfcc'
          ]

        const f2 = gui.addFolder('Extrctr')
        f2.add(this.mods.baseRoughness, 'mapTo', features).name('baseRoughness').onChange(val => this.mods.baseRoughness['mapTo'] = val)
        f2.add(this.mods.baseRoughness, 'outmin').min(0).max(10).onChange(val => this.mods.baseRoughness.outmin = val)
        f2.add(this.mods.baseRoughness, 'outmax').min(0).max(10).onChange(val => this.mods.baseRoughness.outmax = val)
        // f2.add(this.mods, 'numLayers', features).onChange(val => this.mods.numLayers = {mapTo: val})
        // f2.add(this.mods.numLayers, 'outmin').min(0).max(10).onChange(val => this.mods.numLayers = {outmin: val})
        // f2.add(this.mods.numLayers, 'outmax').min(0).max(10).onChange(val => this.mods.numLayers = {outmax: val})
        f2.add(this.mods.persistence, 'mapTo', features).onChange(val => this.mods.persistence.mapTo = val)
        f2.add(this.mods.persistence, 'outmin').min(0).max(10).onChange(val => this.mods.persistence.outmin = val)
        f2.add(this.mods.persistence, 'outmax').min(0).max(10).onChange(val => this.mods.persistence.outmax = val)
        f2.add(this.mods.roughness, 'mapTo', features).onChange(val => this.mods.roughness.mapTo = val)
        f2.add(this.mods.roughness, 'outmin').min(0).max(10).onChange(val => this.mods.roughness.outmin = val)
        f2.add(this.mods.roughness, 'outmax').min(0).max(10).onChange(val => this.mods.roughness.outmax = val)
        f2.add(this.mods.speed, 'mapTo', features).onChange(val => this.mods.speed.mapTo = val)
        f2.add(this.mods.speed, 'outmin').min(0).max(10).onChange(val => this.mods.speed.outmin = val)
        f2.add(this.mods.speed, 'outmax').min(0).max(10).onChange(val => this.mods.speed.outmax = val)
        f2.add(this.mods.strength, 'mapTo', features).onChange(val => this.mods.strength.mapTo = val)
        f2.add(this.mods.strength, 'outmin').min(0).max(10).onChange(val => this.mods.strength.outmin = val)
        f2.add(this.mods.strength, 'outmax').min(0).max(10).onChange(val => this.mods.strength.outmax = val)

        f2.open()

        
    
    } 



}
