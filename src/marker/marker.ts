import { readFileSync, writeFileSync } from 'fs';

export abstract class Marker {
  markFile(filename: string, mono?: boolean): void {
    const content = readFileSync(filename, 'utf8');
    writeFileSync(filename.replace(/.en\.(\w+)$/, '.cn.$1'), this.markContent(content, mono), 'utf8');
  }

  abstract markContent(content: string, mono?: boolean): string;
}
