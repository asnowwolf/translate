export interface Visitor<T> {
  (original: string, translation?: string): Promise<string | undefined>;
}
