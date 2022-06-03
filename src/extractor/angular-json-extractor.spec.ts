import { AngularJsonExtractor } from './angular-json-extractor';

describe('angular json extractor', () => {
  it('extract pairs', () => {
    const extractor = new AngularJsonExtractor();
    const pairs = extractor.extractSentencePairsFromContent(`{
  "TopBar": [
    {
      "url": "features",
      "titleCn": "特性",
      "title": "Features"
    },
    {
      "url": "docs",
      "titleCn": "文档",
      "title": "Docs",
      "children": [
        {
          "url": "guide/what-is-angular",
          "titleCn": "什么是 Angular？",
          "title": "What is Angular?",
          "tooltipCn": "Angular 平台的简要描述。",
          "tooltip": "A brief description of the Angular platform."
        },
        {
          "titleCn": "试一试",
          "title": "Try it",
          "tooltipCn": "检查和使用现成的示例应用，无需设置。",
          "tooltip": "Examine and work with a ready-made sample app, with no setup."
        }
      ]
    }
  ]
}`);
    expect(pairs).toEqual([
      {
        'chinese': '特性',
        'english': 'Features',
        'format': 'plain',
      },
      {
        'chinese': '文档',
        'english': 'Docs',
        'format': 'plain',
      },
      {
        'chinese': '什么是 Angular？',
        'english': 'What is Angular?',
        'format': 'plain',
      },
      {
        'chinese': 'Angular 平台的简要描述。',
        'english': 'A brief description of the Angular platform.',
        'format': 'plain',
      },
      {
        'chinese': '试一试',
        'english': 'Try it',
        'format': 'plain',
      },
      {
        'chinese': '检查和使用现成的示例应用，无需设置。',
        'english': 'Examine and work with a ready-made sample app, with no setup.',
        'format': 'plain',
      },
    ]);
  });
});
