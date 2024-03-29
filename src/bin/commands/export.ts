import { CommandBuilder } from 'yargs';
import { sync as globby } from 'globby';
import { getExporterFor } from '../../exporter/get-exporter-for';
import { ExportOptions } from '../../exporter/common';
import { MAX_VISUAL_LENGTH } from '../../translator/subtitle-translator';

export const command = `export <sourceGlobs...>`;

export const describe = '把成果物导出为指定的格式';

export const builder: CommandBuilder = {
  sourceGlobs: {
    description: '文件通配符，不同的扩展名导出方式不同。注意：要包含在引号里，参见 https://github.com/isaacs/node-glob#glob-primer',
  },
  cwd: {
    description: '源文件的基础路径，用于从文件名计算出相对路径，以便计算出相对路径，与 outputDir 一起使用',
    default: '.',
  },
  outputDir: {
    description: '结果要输出到的目录',
    // 默认写回原地
    default: '.',
  },
  format: {
    description: '把结果输出成指定的格式，目前只支持写回原有格式',
    type: 'string',
    choices: ['auto', 'markdown', 'html'],
    default: 'auto',
  },
  maxVisualLength: {
    description: '最大可视长度，超过这个长度的文本会被截断（适用于字幕文件）',
    type: 'number',
    default: MAX_VISUAL_LENGTH,
  },
  mono: {
    description: '结果中只包含中文，即只生成单一格式而非对照格式（但对字幕文件永远为 true）',
    type: 'boolean',
    default: false,
  },
};

export const handler = function (params: ExportOptions & { sourceGlobs: string[] }) {
  const filenames = globby(params.sourceGlobs);
  if (filenames.length === 0) {
    console.error('没有找到任何文件，请检查 sourceGlobs 是否正确！');
    return;
  }
  for (const filename of filenames) {
    console.log('Exporting: ', filename);
    const marker = getExporterFor(filename);
    marker.exportFile(filename, params);
  }
};
