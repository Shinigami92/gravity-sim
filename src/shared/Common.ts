/**
 * Gravitational constant
 *
 * m³ kg⁻¹ s⁻²
 */
export const G = 6.67408 * Math.pow(10, -11);

/**
 * Calculate gravitational force between two objects
 *
 * @param m1 Mass of the first object
 * @param m2 Mass of the second object
 * @param r Distance between both objects
 */
export function gravitationalForce(m1: number, m2: number, r: number) {
  return G * ((m1 * m2) / Math.pow(r, 2));
}
