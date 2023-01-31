import { readFileSync, writeFileSync } from 'fs';
import { ExportOptions } from './common';

export abstract class Exporter {
  exportFile(filename: string, options: ExportOptions): void {
    const content = readFileSync(filename, 'utf8');
    writeFileSync(this.getTargetFileName(filename), this.exportContent(content, options), 'utf8');
  }

  // 默认写回原地
  protected getTargetFileName(filename: string) {
    return filename;
  }

  abstract exportContent(content: string, options: ExportOptions): string;
}

