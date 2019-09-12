class ThreeController {
  contructor(containerId) {
    this.container = document.getElementById(containerId)
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.scene = new THREE.Scene()
    this.group = new THREE.Group()
  
    // window.innerWidth = 1920
    // window.innerHeight = 1080
  
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.container.append(this.render.domElement)
  
    this.camera = new THREE.PerspectiveCamera(
      67.5, window.innerWidth / window.innerHeight, 0.5, 10000
    )
    this.camera.lookAt(this.scene.position)
    this.scene.add(this.camera)
  
    this.camera.position.z = 75
  
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
  }
}