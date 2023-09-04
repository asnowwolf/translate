export type ExportFormat = 'auto' | 'html' | 'markdown';

export interface ExportOptions {
  cwd?: string;
  outputDir: string;
  format?: ExportFormat;
  mono?: boolean;
}
