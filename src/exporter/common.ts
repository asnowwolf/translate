export enum ExportFormat {
  // 自动跟随原文：原文是 html 就导出 html，原文是 markdown 就导出 markdown，将来会支持转换格式
  auto = 'auto',
}

export interface ExportOptions {
  outputDir: string;
}
