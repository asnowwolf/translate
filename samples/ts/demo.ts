/**
 * @license
 * One
 */

/** Two */
let nextUniqueId = 0;

// comment
/**
 * Three{@link CdkMenu}
 *
 * **Four**
 */
export class Demo {
  constructor(
    /** Five */
    public a: string,
  ) {
  }

  /** Six */
  b: string;

  /**
   * Seven.
   *
   * Eight
   *
   * @param {Number} p1 Eight One
   * @param p2 Eight Two
   * @param {String} [p3] Eight Three
   * @param {(string|string[])} [p4=Eight Four] - Eight Five
   * @see bar
   * @see
   * http://github.com|Nine
   * @returns One
   */
  foo1(p1: number, p2: string, p3: string, p4: string): number {
    return 1;
  }

  /** Two */
  foo2(): void {
  }
}
