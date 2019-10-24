class ThreeController {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.scene = new THREE.Scene()
    this.group = new THREE.Group()
    this.clock = new THREE.Clock()

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.container.append(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(67.5, window.innerWidth / window.innerHeight, 0.5, 10000)
    this.camera.lookAt(this.scene.position)
    this.scene.add(this.camera)

    this.camera.position.z = 75

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)

    window.addEventListener('resize', this.onWindowResize, false);

    this.objects = {}
    this.lights = {}
  }

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  createMaterials = () => {
    this.materials = {
      plane: new THREE.MeshPhongMaterial({
        color: 0x22aa99,
        side: THREE.DoubleSide,
        reflectivity: 100,
        shininess: 1000,
        wireframe: true,
        shading: THREE.FlatShading,
      })
    }

    return this.materials
  }

  removeObject = object => {
    const selectedObject = this.scene.getObjectByName(object.name);
    this.scene.remove(selectedObject);
  }

  createPlane = (x, y, z) => {
    const planeGeometry = new THREE.PlaneGeometry(800, 800, 40, 40)
    const plane = new THREE.Mesh(planeGeometry, this.materials.plane)
    plane.rotation.x = -0.5 * Math.PI
    plane.position.set(x, y, z)

    return plane
  }

  createPlanes = () => {
    this.objects.topPlane = this.createPlane(0, 30, 0)
    this.objects.bottomPlane = this.createPlane(0, -30, 0)
    this.group.add(this.objects.topPlane)
    this.group.add(this.objects.bottomPlane)

    return this.objects
  }

  createLights = () => {
    const lights = {}

    lights.ambient = new THREE.AmbientLight(0xaaaaaa)
    this.scene.add(lights.ambient)

    lights.spot = new THREE.SpotLight(0xffffff)
    lights.spot.intensity = 0.3
    lights.spot.position.set(-10, 40, 20)
    lights.spot.castShadow = true
    three.scene.add(lights.spot)

    // const sphere = new THREE.SphereBufferGeometry(1, 16, 8)

    lights.rotating = [0xff0040, 0x0040ff, 0x80ff80, 0xffaa00].map(color => {
      const light = new THREE.PointLight(color, 0.5, 50)
      // light.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color } )))
      this.scene.add(light)
      return light
    })

    this.lights = lights

    return this.lights
  }

  rotateLights = () => {
    const time = Date.now() * 0.0005
    const delta = three.clock.getDelta()

    this.lights.rotating[0].position.y = Math.cos(time * 0.5) * 40
    this.lights.rotating[0].position.z = Math.cos(time * 0.3) * 30
    this.lights.rotating[0].position.x = Math.sin(time * 0.7) * 30

    this.lights.rotating[1].position.x = Math.cos(time * 0.3) * 30
    this.lights.rotating[1].position.y = Math.sin(time * 0.5) * 40
    this.lights.rotating[1].position.z = Math.sin(time * 0.7) * 30

    this.lights.rotating[2].position.x = Math.sin(time * 0.7) * 30
    this.lights.rotating[2].position.y = Math.cos(time * 0.3) * 40
    this.lights.rotating[2].position.z = Math.sin(time * 0.5) * 30

    this.lights.rotating[3].position.x = Math.sin(time * 0.3) * 30
    this.lights.rotating[3].position.y = Math.cos(time * 0.7) * 40
    this.lights.rotating[3].position.z = Math.sin(time * 0.5) * 30
  }

  setPlanesColor = (...a) => {
    const planes = [this.objects.topPlane, this.objects.bottomPlane]
    planes.forEach(plane => updateColor(plane.material, ...a))
  }

  setAmbientLightColor = (...a) => updateColor(this.lights.ambient, ...a)

  setSpotLightColor = (...a) => updateColor(this.lights.spot, ...a)

  updateRLight = i => (...a) => updateColor(this.lights.rotating[i], ...a)
}
