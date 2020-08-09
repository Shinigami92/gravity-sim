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

/**
 * Gravitational constant
 *
 * m³ kg⁻¹ s⁻²
 */
const G = 6.67408 * Math.pow(10, -11);

function gravitationalForce(m1: number, m2: number, r: number) {
  return G * ((m1 * m2) / Math.pow(r, 2));
}

// Animate
let then = 0;

function animate(now: number) {
  now *= 0.001; // make it seconds

  const delta = now - then;
  then = now;

  // Calculate
  const f1 = gravitationalForce(
    celestialBodies[0].mass,
    celestialBodies[1].mass,
    celestialBodies[0].position.distanceTo(celestialBodies[1].position)
  );

  const f2 = gravitationalForce(
    celestialBodies[1].mass,
    celestialBodies[0].mass,
    celestialBodies[1].position.distanceTo(celestialBodies[0].position)
  );

  celestialBodies[0].velocity.add(
    celestialBodies[1].position
      .clone()
      .sub(celestialBodies[0].position)
      .normalize()
      .multiplyScalar(delta * f1)
  );
  celestialBodies[1].velocity.add(
    celestialBodies[0].position
      .clone()
      .sub(celestialBodies[1].position)
      .normalize()
      .multiplyScalar(delta * f2)
  );

  // Apply
  celestialBodies[0].position.add(celestialBodies[0].velocity);
  celestialBodies[1].position.add(celestialBodies[1].velocity);

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

export default Vue.extend({
  name: "App",
  beforeMount() {
    requestAnimationFrame(animate);
  },
});
