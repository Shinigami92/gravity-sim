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
const celestialBody1 = new CelestialBody({
  radius: 0.5,
  color: 0xff0000,
  mass: 1e1,
  position: new Vector3(-10, 0, 0),
  velocity: new Vector3(0, 0, 0.05),
});
scene.add(celestialBody1);

const celestialBody2 = new CelestialBody({
  radius: 1,
  color: 0x0000ff,
  mass: 120_000_000,
  position: new Vector3(8, 0, 0),
  velocity: new Vector3(0, 0, -0.05),
});
scene.add(celestialBody2);

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
function animate() {
  requestAnimationFrame(animate);

  // Calculate
  const f1 = gravitationalForce(
    celestialBody1.mass,
    celestialBody2.mass,
    celestialBody1.position.distanceTo(celestialBody2.position)
  );

  const f2 = gravitationalForce(
    celestialBody2.mass,
    celestialBody1.mass,
    celestialBody2.position.distanceTo(celestialBody1.position)
  );

  celestialBody1.velocity.add(
    celestialBody2.position
      .clone()
      .sub(celestialBody1.position)
      .normalize()
      .multiplyScalar(f1)
  );
  celestialBody2.velocity.add(
    celestialBody1.position
      .clone()
      .sub(celestialBody2.position)
      .normalize()
      .multiplyScalar(f2)
  );

  // Apply
  celestialBody1.position.add(celestialBody1.velocity);
  celestialBody2.position.add(celestialBody2.velocity);

  renderer.render(scene, camera);
}

export default Vue.extend({
  name: "App",
  beforeMount() {
    animate();
  },
});
