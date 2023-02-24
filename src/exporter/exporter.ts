import { readFileSync, writeFileSync } from 'fs';
import { ExportOptions } from './common';
import { dirname, join, relative } from 'path';
import { sync as mkdirp } from 'mkdirp';

export abstract class Exporter {
  exportFile(filename: string, options: ExportOptions): void {
    const content = readFileSync(filename, 'utf8');
    const targetFileName = this.getTargetFileName(filename, options);
    const targetDir = dirname(targetFileName);
    mkdirp(targetDir);
    writeFileSync(targetFileName, this.exportContent(content, options), 'utf8');
  }

  protected getTargetFileName(filename: string, options: ExportOptions) {
    const relativePath = relative('.', filename);
    return join(options.outputDir, relativePath);
  }

  abstract exportContent(content: string, options: ExportOptions): string;
}
