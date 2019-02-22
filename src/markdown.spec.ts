import { describe, it } from 'mocha';
import { expect } from 'chai';
import { markdown } from './markdown';
import { getTranslateEngine } from './engine';
import { TranslationEngineType } from './common';
import mdParse = markdown.parse;

describe('markdown', () => {
  it('markdown to html', () => {
    expect(markdown.mdToHtml(mdParse(`# h1`))).eql(`<h1>h1</h1>
`);
  });
  it('html to markdown', () => {
    expect(markdown.stringify(markdown.htmlToMd(`<h1>H1</h1>`))).eql('# H1\n');
  });

  it('translate', (done) => {
    const tree = markdown.parse(`# Head 1

Test

1. a
1. b
   1. b1
   1. b2
   1. b3

- a
  - b
  - c

> a

> b
>> c

>> d

| a | a |
|----|----|
| b | b |
| c | c |
`);
    markdown.translate(tree, getTranslateEngine(TranslationEngineType.fake)).subscribe(tree => {
      expect(markdown.stringify(tree)).eql(`# Head 1

# 译Head 1


Test

译Test


1. a

   译a

1. b

   译b


   1. b1

      译b1

   1. b2

      译b2

   1. b3

      译b3


- a

  译a


  - b

    译b

  - c

    译c


> a
>
> 译a
>
>
> b
>
> 译b
>
>
> > c
> >
> > 译c
> >
>
> > d
> >
> > 译d
> >

| a   | a   |
| --- | --- |
| 译a | 译a |
| b   | b   |
| 译b | 译b |
| c   | c   |
| 译c | 译c |
`);
      done();
    });
  });
});
