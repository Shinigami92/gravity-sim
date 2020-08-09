import Vue from "vue";
import { Scene, PerspectiveCamera, WebGLRenderer } from "three";

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
