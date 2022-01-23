/**
 * @license
 * Copyright
 */

/** Js Doc for standalone variable */
let nextUniqueId = 0;

// comment
/**
 * Js Doc with {@link CdkMenu})
 *
 * The second line with *markdown*
 */
export class Demo {
  constructor(
    /** Js Doc for parameter as property */
    public a: string,
  ) {
  }

  /** Js Doc for property */
  b: string;

  /**
   * Js Doc for Method 1.
   *
   * The second line
   *
   * @param {Number} p1 Js Doc for parameter 1
   * @param p2 Js Doc for parameter 2
   * @param {String} [p3] Js Doc for parameter 3
   * @param {(string|string[])} [p4=John Doe] - Somebody's name, or an array of names.
   * @see bar
   * @see
   * http://github.com|GitHub
   * @returns Js Doc for Return value
   */
  foo1(p1: number, p2: string, p3: string, p4: string): number {
    return 1;
  }

  /** Single line Js Doc for Method 2. */
  foo2(): void {
  }
}
