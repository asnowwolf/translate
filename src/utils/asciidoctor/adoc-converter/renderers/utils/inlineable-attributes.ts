export interface InlineableAttribute {
  name: string;
  // 注意，这是 1-based 位置
  position?: number;
}

export const audioInlineableAttributes: InlineableAttribute[] = [
  { name: 'title' },
  { name: 'start' },
  { name: 'end' },
  { name: 'options' },
];
export const imageInlineableAttributes: InlineableAttribute[] = [
  { name: 'alt', position: 1 },
  { name: 'fallback' },
  { name: 'title' },
  { name: 'format' },
  { name: 'caption' },
  { name: 'width', position: 2 },
  { name: 'height', position: 3 },
  { name: 'window' },
  { name: 'scale' },
  { name: 'scaledwidth' },
  { name: 'pdfwidth' },
  { name: 'align' },
  { name: 'float' },
  { name: 'role' },
  { name: 'options' },
];
export const videoInlineableAttributes: InlineableAttribute[] = [
  { name: 'alt' },
  { name: 'float' },
  { name: 'align' },
  { name: 'title' },
  { name: 'poster', position: 1 },
  { name: 'width', position: 2 },
  { name: 'height', position: 3 },
  { name: 'start' },
  { name: 'end' },
  { name: 'theme' },
  { name: 'lang' },
  { name: 'list' },
  { name: 'playlist' },
  { name: 'options' },
];
