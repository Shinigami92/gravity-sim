import {
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from "three";
import Vue from "vue";

// Init
const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Init Objects
const geometry1 = new SphereGeometry(0.5);
const material1 = new MeshBasicMaterial({ color: 0xff0000 });
const sphere1 = new Mesh(geometry1, material1);
sphere1.position.x = -2;
scene.add(sphere1);

const geometry2 = new SphereGeometry(0.5);
const material2 = new MeshBasicMaterial({ color: 0x0000ff });
const sphere2 = new Mesh(geometry2, material2);
sphere2.position.x = 2;
scene.add(sphere2);

camera.position.z = 5;

// Animate
function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

export default Vue.extend({
  name: "App",
  beforeMount() {
    animate();
  },
});
