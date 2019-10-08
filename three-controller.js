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
      }),
      sphere: new THREE.MeshPhongMaterial({
        color: 0xaa90dd,
        reflectivity:  100,
        shading:  THREE.FlatShading,
        // wireframe: true,
      }),
    }

    return this.materials
  }

  removeObject = object => {
    const selectedObject = this.scene.getObjectByName(object.name);
    this.scene.remove(selectedObject);
  }

  createIcoGeometry = (radius, detail) => new THREE.IcosahedronGeometry(radius, detail)

  createIco = ({ detail, material=this.materials.sphere, radius }) => {
    const ico = new THREE.Mesh(this.createIcoGeometry(radius, detail), material)
    ico.rotation.z = 0.5
    ico.name = 'sphere'
    ico.castShadow = true

    this.group.add(ico)
    this.objects.ico = ico

    return this.objects.ico
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
      const light = new THREE.PointLight(color, 2, 50)
      // light.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color } )))
      this.scene.add(light1)
      return light
    })

    this.lights = lights

    return this.lights
  }

  setIcoDetail = detail => {
    const ico = this.objects.ico
    const old = ico.geometry
    ico.geometry = this.createIcoGeometry(10, detail)
    old.dispose()
  }

  setIcoColor = c => updateColor(ico.material, c)

  setPlanesColor = c => {
    const planes = [this.objects.topPlane, this.objects.bottomPlane]
    planes.forEach(plane => updateColor(plane.material, c))
  }

  setAmbientLightColor = c => updateColor(this.lights.ambient, c)

  setSpotLightColor = c => updateColor(this.lights.spot, c)

  updateRLight = i => c => updateColor(this.lights.rotating[i], c)
}
