class ThreeController {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.scene = new THREE.Scene()
    this.group = new THREE.Group()
  
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.container.append(this.renderer.domElement)
  
    this.camera = new THREE.PerspectiveCamera(
      67.5, window.innerWidth / window.innerHeight, 0.5, 10000
    )
    this.camera.lookAt(this.scene.position)
    this.scene.add(this.camera)
  
    this.camera.position.z = 75
  
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)

    this.objects = {}
    this.lights = {}
  }

  createMaterials = () => {
    this.materials = {
      sphere: new THREE.MeshPhongMaterial({
        color:  0xaa90dd,
        // reflectivity:  100,
        // shading:  THREE.FlatShading,
        // wireframe: true,
      }),
      plane: new THREE.MeshPhongMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        reflectivity: 1,
        shininess: 1000,
        wireframe: true,
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
    this.lights.ambientLight = new THREE.AmbientLight(0xaaaaaa)
    this.scene.add(this.lights.ambientLight)

    this.lights.spotLight = new THREE.SpotLight(0xffffff)
    this.lights.spotLight.intensity = 0.9
    this.lights.spotLight.position.set(-10, 40, 20)
    this.lights.spotLight.castShadow = true
    three.scene.add(this.lights.spotLight)

    return this.lights
  }
}