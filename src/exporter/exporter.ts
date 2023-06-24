import { readFileSync, writeFileSync } from 'fs';
import { ExportOptions } from './common';
import { dirname, join, parse, relative } from 'path';
import { sync as mkdirp } from 'mkdirp';

export abstract class Exporter {
  exportFile(filename: string, options: ExportOptions): void {
    const content = readFileSync(filename, 'utf8');
    const targetFileName = this.getTargetFileName(filename, options);
    const targetDir = dirname(targetFileName);
    mkdirp(targetDir);
    const result = this.exportContent(content, options);
    if (result === undefined) {
      console.warn(`Unsupported file: ${filename}`);
    } else {
      writeFileSync(targetFileName, result, 'utf8');
    }
  }

  protected getTargetFileName(filename: string, options: ExportOptions): string {
    const relativePath = relative(options.cwd ?? '.', filename);
    const targetFileName = join(options.outputDir ?? '.', relativePath);
    if (options.format === 'auto') {
      return targetFileName;
    }
    const parsed = parse(targetFileName);
    if (options.format === 'markdown') {
      return `${parsed.dir}/${parsed.name}.md`;
    } else if (options.format === 'html') {
      return `${parsed.dir}/${parsed.name}.html`;
    }
  }

  abstract exportContent(content: string, options: ExportOptions): string;
}
