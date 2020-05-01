import * as dat from 'dat.gui'

export const createGui = (three) => {
    const gui = new dat.GUI({ height: 5 * 32 - 1 })

    const style = gui.addFolder('Style')

    style.addColor({ color: '#aaaaaa' }, 'color').name('Ambient Light').onChange(three.setAmbientLightColor)

    style.addColor({ color: '#ffffff' }, 'color').name('Spot Light').onChange(three.setSpotLightColor)

    const colors = ['#ff0040', '#0040ff', '#80ff80', '#ffaa00']
    colors.forEach((color, i) => {
        style.addColor({ color }, 'color').name(`Point Light ${i}`).onChange(three.updateRLight(i))
    })

    return gui
}
