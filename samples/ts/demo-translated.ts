/**
 * @license
 * One
 */

/**
 * Two
 *
 * 译 Two
 *
 */
let nextUniqueId = 0;

// comment
/**
 * Three{@link CdkMenu}
 *
 * 译 Three{@link CdkMenu}
 *
 * **Four**
 *
 * **译 Four**
 *
 */
export class Demo {
  constructor(
    /** Five */
    public a: string,
  ) {
  }

  /**
   * Six
   *
   * 译 Six
   *
   */
  b: string;

  /**
   * Seven.
   *
   * 译 Seven.
   *
   * Eight
   *
   * 译 Eight
   *
   * @param {Number} p1 Eight One
   *
   * 译 Eight One
   *
   * @param p2 Eight Two
   *
   * 译 Eight Two
   *
   * @param {String} [p3] Eight Three
   *
   * 译 Eight Three
   *
   * @param {(string|string[])} [p4=Eight Four] - Eight Five
   *
   *   译 Eight Five
   *
   * @see bar
   *
   * 译 bar
   *
   * @see http://github.com|Nine
   *
   * [译 http://github.com|Nine](http://github.com%7CNine)
   *
   * @returns
   *
   * One
   *
   * 译 One
   *
   */
  foo1(p1: number, p2: string, p3: string, p4: string): number {
    return 1;
  }

  /**
   * Two
   *
   * 译 Two
   *
   */
  foo2(): void {
  }
}
