import {
  Color,
  Geometry,
  Material,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  SphereGeometry,
  Vector3,
} from "three";
import { gravitationalForce } from "./Common";

export interface CelestialBodyOptions {
  radius: number;
  color: number | Color;
  mass: number;
  position: Vector3;
  velocity: Vector3;
}

// Could possibly extend Mesh 🤔
export class CelestialBody extends Object3D {
  public mass: number;
  public readonly velocity: Vector3;

  private readonly geometry: Geometry;
  private readonly material: Material;
  private readonly mesh: Mesh;

  public constructor(options: CelestialBodyOptions) {
    super();

    this.geometry = new SphereGeometry(options.radius);
    this.material = new MeshPhongMaterial({ color: options.color });
    this.mesh = new Mesh(this.geometry, this.material);

    this.add(this.mesh);

    this.position.x = options.position.x;
    this.position.y = options.position.y;
    this.position.z = options.position.z;

    this.velocity = options.velocity;
    this.mass = options.mass;
  }

  public calculateVelocity(celestialBodies: CelestialBody[], delta: number) {
    for (const celestialBody of celestialBodies) {
      if (celestialBody.id === this.id) {
        continue;
      }

      const force = gravitationalForce(
        this.mass,
        celestialBody.mass,
        this.position.distanceTo(celestialBody.position)
      );

      this.velocity.add(
        celestialBody.position
          .clone()
          .sub(this.position)
          .normalize()
          .multiplyScalar(delta * force)
      );
    }
  }

  public applyCalculatedVelocity() {
    this.position.add(this.velocity);
  }
}
