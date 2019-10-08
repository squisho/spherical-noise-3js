const createGui = three => {
    const gui = new dat.GUI({ height : 5 * 32 - 1 })

    const style = gui.addFolder('Style')

    style.add({ detail: 5 }, 'detail').name('Ico Detail').min(0).max(5).step(1).onChange(three.setIcoDetail)

    // style.addColor({ color: '#aa90dd' }, 'color').name('Ico Color').onChange(three.setIcoColor)

    // style.addColor({ color: '#22aa99' }, 'color').name('Plane Color').onChange(three.setPlanesColor)

    style.addColor({ color: '#aaaaaa' }, 'color').name('Ambient Light').onChange(three.setAmbientLightColor)

    style.addColor({ color: '#ffffff' }, 'color').name('Spot Light').onChange(three.setSpotLightColor)

    const colors = ['#ff0040', '#0040ff', '#80ff80', '#ffaa00']
    colors.forEach((color, i) => {
        style.addColor({ color }, 'color').name(`Point Light ${i}`).onChange(three.updateRLight(i))
    })
}