export interface Reader {
  getLines(): string[];

  getString(): string;

  file: string;

  dir: string;

  path: string;

  lineno: number;

  source_lines: string[];

  process_lines: string[];

  unterminated: boolean;

  $prepare_lines(data: any, options: any): void;

  $process_ine(line: any): void;

  pushInclude(content: string[], target: string, target2: string, number: number, attrs: any): any;
}
