import { CelestialBody } from "@/shared/CelestialBody";
import {
  AmbientLight,
  AxesHelper,
  Object3D,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Vue from "vue";

// Init
const scene = new Scene();
const camera = new PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Init Objects
const celestialBodies: CelestialBody[] = [
  new CelestialBody({
    radius: 0.5,
    color: 0xff0000,
    mass: 1_000,
    position: new Vector3(-10, 0, 0),
    velocity: new Vector3(0, 0, 0.05),
  }),
  new CelestialBody({
    radius: 1,
    color: 0x0000ff,
    mass: 120_000_000,
    position: new Vector3(8, 0, 0),
    velocity: new Vector3(0.05, 0, -0.05),
  }),
  new CelestialBody({
    radius: 0.7,
    color: 0x00ff00,
    mass: 900,
    position: new Vector3(0, 0, -9),
    velocity: new Vector3(-0.1, 0.01, -0.05),
  }),
];

scene.add(...celestialBodies);

const pointLight = new PointLight(0xffffff, 1, 1000);
pointLight.position.set(0, 0, 0);
pointLight.castShadow = true;
scene.add(pointLight);

const ambientLight = new AmbientLight(0x404040, 1);
scene.add(ambientLight);

const axesHelper = new AxesHelper(5);
scene.add(axesHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableKeys = false;
controls.screenSpacePanning = false;

let updateTarget: Object3D | null = axesHelper;
controls.target = updateTarget.position;
camera.position.set(0, 5, 20);
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
        updateTarget = celestialBodies[0];
        break;
      case "3":
        updateTarget = celestialBodies[1];
        break;
      case "4":
        updateTarget = celestialBodies[2];
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
    camera.position.set(0, 5, 20);
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
