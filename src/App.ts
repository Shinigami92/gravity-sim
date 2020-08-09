import { CelestialBody } from "@/shared/CelestialBody";
import {
  AmbientLight,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
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
    mass: 100,
    position: new Vector3(-10, 0, 0),
    velocity: new Vector3(0, 0, 0.05),
  }),
  new CelestialBody({
    radius: 1,
    color: 0x0000ff,
    mass: 1_200_000_000,
    position: new Vector3(8, 0, 0),
    velocity: new Vector3(0, 0, -0.05),
  }),
];

scene.add(...celestialBodies);

const pointLight = new PointLight(0xffffff, 1, 1000);
pointLight.position.set(0, 0, 0);
pointLight.castShadow = true;
scene.add(pointLight);

const ambientLight = new AmbientLight(0x404040, 1);
scene.add(ambientLight);

camera.position.y = 20;
camera.position.z = 20;
camera.lookAt(0, 0, 0);

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

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

export default Vue.extend({
  name: "App",
  beforeMount() {
    requestAnimationFrame(animate);
  },
});
