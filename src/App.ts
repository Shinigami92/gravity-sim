import { celestialBodies } from "@/shared/systems/SolarSystem";
import {
  AmbientLight,
  AxesHelper,
  Object3D,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Vue from "vue";

// Init
const scene = new Scene();
const camera = new PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  10,
  1_000_000
);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(...celestialBodies);

const ambientLight = new AmbientLight(0x404040, 1);
scene.add(ambientLight);

const axesHelper = new AxesHelper(2000);
scene.add(axesHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableKeys = false;
controls.screenSpacePanning = false;

let updateTarget: Object3D | null = axesHelper;
controls.target = updateTarget.position;
camera.position.set(0, 149_598_023e-4 / 3, 149_598_023e-4 * 0.7);
camera.up.set(0, 1, 0);
updateTarget.add(camera);
updateTarget = null;
controls.update();

document.addEventListener(
  "keyup",
  (event) => {
    console.debug("keyup:", event.key);

    switch (event.key) {
      case "1":
        updateTarget = axesHelper;
        break;
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        const index = +event.key - 2;
        if (celestialBodies[index]) {
          updateTarget = celestialBodies[index];
        }
        break;
    }
  },
  false
);

// Animate
let then = 0;

function animate(now: number) {
  now *= 0.001; // make it seconds

  const delta = now - then;
  then = now;

  // Calculate gravitational force
  for (const celestialBody of celestialBodies) {
    celestialBody.calculateVelocity(celestialBodies, delta);
  }

  // Apply calculated gravitational force
  for (const celestialBody of celestialBodies) {
    celestialBody.applyCalculatedVelocity();
  }

  if (updateTarget) {
    controls.target = updateTarget.position;
    // camera.position.set(0, 5, 20);
    updateTarget.add(camera);
    updateTarget = null;
  }

  controls.update();

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

export default Vue.extend({
  name: "App",
  beforeMount() {
    requestAnimationFrame(animate);
  },
});
