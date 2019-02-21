import { describe, it } from 'mocha';
import { expect } from 'chai';
import { markdown } from './markdown';
import { getTranslateEngine } from './engine';
import { TranslationEngineType } from './common';

describe('markdown', () => {
  it('parse', (done) => {
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

# \\[译]Head 1

Test

\\[译]Test

1.  a

    \\[译]a

2.  b

    \\[译]b

    1.  b1

        \\[译]b1

    2.  b2

        \\[译]b2

    3.  b3

        \\[译]b3


-   a

    \\[译]a

    -   b

        \\[译]b

    -   c

        \\[译]c


> a
>
> \\[译]a
>
> b
>
> \\[译]b
>
> > c
> >
> > \\[译]c
>
> > d
> >
> > \\[译]d

| a     | a     |
| ----- | ----- |
| \\[译]a | \\[译]a |
| b     | b     |
| \\[译]b | \\[译]b |
| c     | c     |
| \\[译]c | \\[译]c |
`);
      done();
    });
  });
});
