const createGui = three => {
    const gui = new dat.GUI({ height : 5 * 32 - 1 })

    const style = gui.addFolder('Style')

    style.add({ detail: 5 }, 'detail').name('Ico Detail').min(0).max(5).step(1).onChange(value => {
        const ico = three.obbjects.ico
        const old = ico.geometry
        ico.geometry = three.createIcoGeometry(10, value)
        old.dispose()
    })

    const h2x = c => c.replace('#', '0x')

    const updateColor = obj => c => obj.color.setHex(h2x(c))

    style.addColor({ color: '#aa90dd' }, 'color').name('Ico Color').onChange(updateColor(ico.material))

    style.addColor({ color: '#22aa99' }, 'color').name('Plane Color').onChange(color => {
        const planes = [three.objects.topPlane, three.objects.bottomPlane]
        planes.forEach(plane => plane.material.color.setHex(h2x(color)))
    })

    style.addColor({ color: '#aaaaaa' }, 'color').name('Ambient Light').onChange(updateColor(three.lights.ambient))

    style.addColor({ color: '#ffffff' }, 'color').name('Spot Light').onChange(updateColor(three.lights.spot))

    const updateRLight = i => updateColor(three.lights.rotating[i])

    style.addColor({ color: '#ff0040' }, 'color').name('Point Light 1').onChange(updateRLight(0))

    style.addColor({ color: '#0040ff' }, 'color').name('Point Light 2').onChange(updateRLight(1))

    style.addColor({ color: '#80ff80' }, 'color').name('Point Light 3').onChange(updateRLight(2))

    style.addColor({ color: '#ffaa00' }, 'color').name('Point Light 4').onChange(updateRLight(3))
}