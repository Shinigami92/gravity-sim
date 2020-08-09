import {
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  Vector3,
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
const mass1 = 1e1;
const velocity1 = new Vector3(0, 0, -0.05);
sphere1.position.x = -5;
scene.add(sphere1);

const geometry2 = new SphereGeometry(0.5);
const material2 = new MeshBasicMaterial({ color: 0x0000ff });
const sphere2 = new Mesh(geometry2, material2);
const mass2 = 1e8;
const velocity2 = new Vector3(0, 0, 0.05);
sphere2.position.x = 5;
scene.add(sphere2);

camera.position.y = 20;
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
    mass1,
    mass2,
    sphere1.position.distanceTo(sphere2.position)
  );

  const f2 = gravitationalForce(
    mass2,
    mass1,
    sphere2.position.distanceTo(sphere1.position)
  );

  velocity1.add(
    sphere2.position
      .clone()
      .sub(sphere1.position)
      .normalize()
      .multiplyScalar(f1)
  );
  velocity2.add(
    sphere1.position
      .clone()
      .sub(sphere2.position)
      .normalize()
      .multiplyScalar(f2)
  );

  // Apply
  sphere1.position.add(velocity1);
  sphere2.position.add(velocity2);

  renderer.render(scene, camera);
}

export default Vue.extend({
  name: "App",
  beforeMount() {
    animate();
  },
});
