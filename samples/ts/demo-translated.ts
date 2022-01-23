/**
 * @license
 * Copyright
 */

/**
 * Js Doc for standalone variable
 *
 * Js Doc for standalone variable[译]
 *
 */
let nextUniqueId = 0;

// comment
/**
 * Js Doc with {@link CdkMenu})
 *
 * Js Doc with {@link CdkMenu})[译]
 *
 * The second line with *markdown*
 *
 * The second line with *markdown*[译]
 *
 */
export class Demo {
  constructor(
    /** Js Doc for parameter as property */
    public a: string,
  ) {
  }

  /**
   * Js Doc for property
   *
   * Js Doc for property[译]
   *
   */
  b: string;

  /**
   * Js Doc for Method 1.
   *
   * Js Doc for Method 1.[译]
   *
   * The second line
   *
   * The second line[译]
   *
   * @param {Number} p1 Js Doc for parameter 1
   *
   * Js Doc for parameter 1[译]
   *
   * @param p2 Js Doc for parameter 2
   *
   * Js Doc for parameter 2[译]
   *
   * @param {String} [p3] Js Doc for parameter 3
   *
   * Js Doc for parameter 3[译]
   *
   * @param {(string|string[])} [p4=John Doe] - Somebody's name, or an array of names.
   *
   *   Somebody's name, or an array of names.[译]
   *
   * @see bar
   *
   * bar[译]
   *
   * @see <http://github.com|GitHub>
   *
   * <http://github.com|GitHub>[译]
   *
   * @returns Js Doc for Return value
   *
   * Js Doc for Return value[译]
   *
   */
  foo1(p1: number, p2: string, p3: string, p4: string): number {
    return 1;
  }

  /**
   * Single line Js Doc for Method 2.
   *
   * Single line Js Doc for Method 2.[译]
   *
   */
  foo2(): void {
  }
}
