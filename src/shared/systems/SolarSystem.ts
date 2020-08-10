import { CelestialBody } from "@/shared/CelestialBody";
import { PointLight, Vector3 } from "three";

const sun = new CelestialBody({
  radius: 695_700e-3, // real: 695_700 km
  color: 0xf8ad4a,
  mass: 1.98874e12, // real: 1.98874e30 kg
  position: new Vector3(0, 0, 0),
  velocity: new Vector3(0, 0, 0),
});

const sunLight = new PointLight(0xffffff, 10, 1_000_000);
sunLight.castShadow = true;

sun.add(sunLight);

const mercury = new CelestialBody({
  radius: 2_439.7e-2 * 2, // real: 2_439.7 km
  color: 0x98959a,
  mass: 3.3011e5, // real: 3.3011e+23
  position: new Vector3(-57_909_050e-4, 0, 0), // real: x = 57_909_050 km
  velocity: new Vector3(0, 0, 47.362), // real: 47.362 km/s
});

const earth = new CelestialBody({
  radius: 6_371e-2 * 2, // real: 6_371 km
  color: 0x263247,
  mass: 5.97237e6, // real: 5.97237e24
  position: new Vector3(-149_598_023e-4, 0, 0), // real: x = 149_598_023 km
  velocity: new Vector3(0, 0, 29.78), // real: 29.78 km/s
});

export const celestialBodies: CelestialBody[] = [sun, mercury, earth];
