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
        color: 0xffffff,
        side: THREE.DoubleSide,
        reflectivity: 1,
        shininess: 1000,
        wireframe: true,
      }),
      sphere: new THREE.MeshPhongMaterial({
        color: 0xaa90dd,
        // reflectivity:  100,
        // shading:  THREE.FlatShading,
        // wireframe: true,
      }),
    }

    return this.materials
  }

  createIco = ({ radius, detail }) => {
    this.objects.ico = new THREE.Mesh(new THREE.IcosahedronGeometry(radius, detail), this.materials.sphere)
    this.objects.ico.rotation.z = 0.5
    this.group.add(this.objects.ico)

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

    lights.ambientLight = new THREE.AmbientLight(0xaaaaaa)
    this.scene.add(lights.ambientLight)

    lights.spotLight = new THREE.SpotLight(0xffffff)
    lights.spotLight.intensity = 0.3
    lights.spotLight.position.set(-10, 40, 20)
    lights.spotLight.castShadow = true
    three.scene.add(lights.spotLight)

    const sphere = new THREE.SphereBufferGeometry(0.01, 16, 8)

    lights.rotating = []
    const light1 = new THREE.PointLight(0xff0040, 2, 50)
    light1.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xff0040 } )))
    this.scene.add(light1)
    lights.rotating.push(light1)

    const light2 = new THREE.PointLight(0x0040ff, 2, 50)
    light2.add(new THREE.Mesh( sphere, new THREE.MeshBasicMaterial({ color: 0x0040ff } )))
    this.scene.add(light2)
    lights.rotating.push(light2)

    const light3 = new THREE.PointLight(0x80ff80, 2, 50)
    light3.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0x80ff80 } )))
    this.scene.add(light3)
    lights.rotating.push(light3)

    const light4 = new THREE.PointLight(0xffaa00, 2, 50)
    light4.add(new THREE.Mesh( sphere, new THREE.MeshBasicMaterial({ color: 0xffaa00 } )))
    this.scene.add(light4)
    lights.rotating.push(light4)

    this.lights = lights

    return this.lights
  }
}
