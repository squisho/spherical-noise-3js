class ThreeController {
  constructor(params) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
  	this.camera = new THREE.PerspectiveCamera(
  		55, window.innerWidth / window.innerHeight, .1, 1000
  	);
  	this.camera.lookAt(this.scene.position);
  	this.camera.position.set(params.size/2, params.size/2, params.camDist);
    this.cameraRotation = 0;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // this.controls = new THREE.OrbitControls(
    //   this.camera, this.renderer.domElement
    // );

    // this.stats = new Stats();
    // this.stats.showPanel(0);
    // document.body.appendChild(this.stats.dom);

    this.resize();
    window.addEventListener("resize", this.resize);
  }

  resize = () => {
    const w = document.body.clientWidth;
    const h = document.body.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  update = ({ rotationSpeed, camDist, size }) => {
    // this.stats.begin();

    // this.controls.update();
    // this.controls.target.set(size/2, size/2, size/2);

    const speed = rotationSpeed;

    const center = new THREE.Vector3(size/2, size/2, size/2);
    const fromCenter = this.camera.position.clone().sub(center);
    const euler = new THREE.Euler(speed, speed * 0.7, speed * 0.3);
    fromCenter.applyEuler(euler);
    const pos = fromCenter.add(center);
    this.camera.position.set(pos.x, pos.y, pos.z);
    this.camera.lookAt(size/2, size/2, size/2);
    console.log(this.camera.position);
  };

  render = () => {
    this.renderer.render(this.scene, this.camera);
  };
}
