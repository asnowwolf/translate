import { AdocBuilder } from '../dom/asciidoctor/adoc-builder/adoc-builder';
import { FakeTranslationEngine } from '../translation-engine/fake-engine';
import { adocTranslate } from './adoc-translator';

async function translate(input: string): Promise<string> {
  const builder = new AdocBuilder();
  const dom = builder.parse(input);
  const engine = new FakeTranslationEngine();
  adocTranslate(dom, engine);
  await engine.flush();
  return builder.build(dom);
}

describe('adoc-translator', () => {
  it('document', async () => {
    const input = `= One: Subtitle for One
:description: Description for "One"`;
    const output = await translate(input);
    expect(output).toBe(`= 译One: Subtitle for One
:description: 译Description for "One"`);
  });
  it('section', async () => {
    const input = `== One`;
    const output = await translate(input);
    expect(output).toBe(`== 译One`);
  });
  it('section with title', async () => {
    const input = `.One
== Two`;
    const output = await translate(input);
    expect(output).toBe(`.译One
== 译Two`);
  });
  xit('indexterm', async () => {
    const input = `I, King Arthur.
(((One, "Two, Three")))`;
    const output = await translate(input);
    expect(output).toBe(`I, King Arthur.
(((译One, "译Two, 译Three")))`);
  });
  it('unordered list', async () => {
    const input = `* [ ] One
** One-Two
* [x] Three`;
    const output = await translate(input);
    expect(output).toEqual(`* [ ] 译One
** 译One-Two
* [x] 译Three`);
  });
  it('description lists', async () => {
    const input = `One:: Description for One.
Two:: Description for Two.`;
    const output = await translate(input);
    expect(output).toEqual(`译One:: 译Description for One.
译Two:: 译Description for Two.`);
  });
  describe('text formats', () => {
    it('simple', async () => {
      const content = `*one* _two_ \`three\` #four# ~five~ ^six^ **seven 译Eight**`;
      const input = await translate(content);
      expect(input).toEqual('*译one* _译two_ `three` #译four# ~译five~ ^译six^ *译seven 译Eight*');
    });

    it('mixed', async () => {
      const content = '`*_one two_*` & ``*__three__*``four``*__five__*``';
      expect(await translate(content)).toEqual('`*_one two_*` & ``*_three_*``译four``*_five_*``');
    });

    it('literal monospace', async () => {
      const content = '`One` is one';
      expect(await translate(content)).toEqual('`One` 译is one');
    });

    it('text span', async () => {
      const content = `One [.two]#Three#`;
      expect(await translate(content)).toEqual('译One [.two]#译Three#');
    });
  });
  describe('links', () => {
    it('autolinks', async () => {
      const content = `One https://www.one.org.
Email to two@example.com`;
      expect(await translate(content)).toEqual(`译One https://www.one.org.
译Email to two@example.com`);
    });

    it('no autolink', async () => {
      const content = `One \\https://three.org. two \\help@three.org`;
      expect(await translate(content)).toEqual(`译One \\https://three.org. two \\help@three.org`);
    });
    it('url macro', async () => {
      const content = `One https://two.asciidoctor.org/[*three four*^, role=green].`;
      expect(await translate(content)).toEqual(`译One https://two.asciidoctor.org/[*译three four*^, role=green].`);
    });
  });
  describe('cross references', () => {
    it('simple', async () => {
      const content = `One <<two>> three`;
      expect(await translate(content)).toEqual(`译One <<two,译[two]>> 译three`);
    });
    it('complex', async () => {
      const content = `One <<two,three>>.`;
      expect(await translate(content)).toEqual(`译One <<two,译three>>.`);
    });
    it('nature', async () => {
      const content = `One <<Two Three Four>>.`;
      expect(await translate(content)).toEqual(`译One <<Two Three Four,译[Two Three Four]>>.`);
    });
    it('cross document', async () => {
      const content = `One <<two-b.adoc#three-b,Four>> five.`;
      expect(await translate(content)).toEqual(`译One <<two-b.adoc#three-b,译Four>> 译five.`);
    });
  });
  describe('resources', () => {
    it('images - block', async () => {
      const content = `image::one.jpg["Two, Three"]`;
      expect(await translate(content)).toEqual(`image::one.jpg["译Two, 译Three"]`);
    });

    it('images - inline', async () => {
      const content = `One image:two.png[] three.

One image:two.png[Three] Four.`;
      expect(await translate(content)).toEqual(`译One image:two.png[译Two] 译Three.

译One image:two.png[译Three] 译Four.`);
    });

    it('image with attributes', async () => {
      const content = `[#one-two,link=https://www.three.com]
.Four
image::five.jpg[Six,200,100]`;
      expect(await translate(content)).toEqual(`[#one-two,link=https://www.three.com]
.译Four
image::five.jpg[译Six,200,100]`);
    });

    it('image with attributes 2', async () => {
      const content = `image::one.png[Two,200,200,float=three,align=four]`;
      expect(await translate(content)).toEqual(`image::one.png[译Two,200,200,float=three,align=four]`);
    });

    it('audio and video', async () => {
      expect(await translate(`video::one.mp4[two,200,200,float=three,align=four]`))
        .toEqual(`video::one.mp4[two,200,200,float=three,align=four]`);
      expect(await translate(`audio::one.mp3[start=60,opts=autoplay]`))
        .toEqual(`[%autoplay]
audio::one.mp3[start=60]`);
    });

    it('icon', async () => {
      const content = `icon:one[link=https://two.com/three]`;
      expect(await translate(content)).toEqual(content);
    });
  });
  describe('macros', () => {
    it('keyboard macro', async () => {
      const content = `:experimental:

One kbd:[Ctrl+F11]`;
      expect(await translate(content)).toEqual(`:experimental:

译One kbd:[Ctrl+F11]`);
    });
    it('button macro', async () => {
      const content = `:experimental:

One btn:[Two] Three.`;
      expect(await translate(content)).toEqual(`:experimental:

译One btn:[译Two] 译Three.`);
    });
    it('menu macro', async () => {
      const content = `:experimental:

One menu:Two[Three].

One menu:Two[Three > Four] Five.`;
      expect(await translate(content)).toEqual(`:experimental:

译One menu:译Two[译Three].

译One menu:译Two[译Three > 译Four] 译Five.`);
    });
  });
  describe('admonitions', () => {
    it('simple', async () => {
      const content = `one

WARNING: Two three`;
      expect(await translate(content)).toEqual(`译One

WARNING: 译Two 译Three`);
    });
    it('complex', async () => {
      const content = `[IMPORTANT]
.One
====
Two

. Three
. Four
. Five
====`;
      expect(await translate(content)).toEqual(`[IMPORTANT]
.译One
====
译Two

. 译Three
. 译Four
. 译Five
====`);
    });
  });

  describe('sidebar', () => {
    it('simple', async () => {
      const content = `[sidebar]
One two three.`;
      expect(await translate(content)).toEqual(content);
    });

    it('complex', async () => {
      const content = `.One
****
Two three.

TIP: Four
****`;
      expect(await translate(content)).toEqual(`.译One
****
译Two 译Three.

TIP: 译Four
****`);
    });
  });
  describe('example blocks', () => {
    it('simple', async () => {
      const content = `[example]
.One
Two.`;
      expect(await translate(content)).toEqual(`[example]
.译One
译Two.`);
    });

    it('complex', async () => {
      const content = `.One
====
Two *three*.

Four *five*.
====`;
      expect(await translate(content)).toEqual(`.译One
====
译Two *译Three*.

译Four *译Five*.
====`);
    });
  });

  describe('blockquotes', () => {
    it('simple', async () => {
      const content = `[quote,Two,Three]
.Four:
Five.`;
      expect(await translate(content)).toEqual(`[quote,译Two,译Three]
.译Four:
译Five.`);
    });
    it('syntax highlight', async () => {
      const content = `[quote,One]
____
Two: Three

Four: Five

Six: Seven
____`;
      expect(await translate(content)).toEqual(`[quote,译One]
____
译Two: 译Three

译Four: 译Five

译Six: 七
____`);
    });

    it('shorthand', async () => {
      const content = `"One"
-- Two, Three`;
      expect(await translate(content)).toEqual(`"译One"
-- 译Two, 译Three`);
    });

    it('markdown', async () => {
      const content = `> > One
>
> Two
>
> > Three
>
> * Four
> * Five
> * Six
>
> > Seven
>
> Eight.`;
      const rebuilt = `____
____
译One
____
译Two

____
译Three
____
* 译Four
* 译Five
* 译Six

____
七
____
八.
____`;
      expect(await translate(content)).toEqual(rebuilt);
    });

  });
  it('verse', async () => {
    const content = `[verse,One,Two]
Three
Four.`;
    expect(await translate(content)).toEqual(content);
  });
  describe('source code blocks', () => {
    it('simple', async () => {
      const content = `[source,ruby]
----
require 'sinatra'

get '/hi' do
  "Hello World!"
end
----`;
      expect(await translate(content)).toEqual(content);
    });
    it('indent', async () => {
      const content = `[source,ruby,indent=0]
----
  require 'sinatra'

  get '/hi' do
    "Hello World!"
  end
----`;
      expect(await translate(content)).toEqual(content);
    });
    it('highlight', async () => {
      const content = `[source#hello,ruby]
----
require 'sinatra'

get '/hi' do
  "Hello World!"
end
----`;
      expect(await translate(content)).toEqual(content);
    });

    it('highlight lines', async () => {
      const content = `[source%linenums,ruby,highlight=2..5]
----
ORDERED_LIST_KEYWORDS = {
  'loweralpha' => 'a',
  'lowerroman' => 'i',
  'upperalpha' => 'A',
  'upperroman' => 'I',
}
----`;
      expect(await translate(content)).toEqual(content);
    });
    it('listing blocks', async () => {
      const content = `[subs=+attributes]
----
One _two_
three \`four\`:

{replace-me}

Five
----`;
      expect(await translate(content)).toEqual(content);
    });

    it('literal style syntax', async () => {
      const content = `[literal]
....
error: One
Two: Three? y/n
....`;
      expect(await translate(content)).toEqual(content);
    });
    it('delimited literal block', async () => {
      const content = `....
One: Two *three*?

Four: Five ...
....`;
      expect(await translate(content)).toEqual(content);
    });

    it('callouts', async () => {
      const content = `[source,ruby]
----
require 'sinatra' <1>

get '/hi' do <2> <3>
  "Hello World!"
end
----

<1> One
<2> Two
<3> Three`;
      expect(await translate(content)).toEqual(`[source,ruby]
----
require 'sinatra' <1>

get '/hi' do <2> <3>
  "Hello World!"
end
----

<1> 译One
<2> 译Two
<3> 译Three`);
    });
    it('with indent', async () => {
      const content = `[source,ruby,indent=2]
----
    def names
      @name.split ' '
    end
----`;
      expect(await translate(content)).toEqual(content);
    });
  });
  describe('tables', () => {
    it('empty', async () => {
      const content = `[cols="1,1"]
|===`;
      expect(await translate(content)).toEqual(content);
    });
    it('with title', async () => {
      const content = `[cols="1,1"]
.One
|===`;
      expect(await translate(content)).toEqual(`[cols="1,1"]
.译One
|===`);
    });
    it('no header', async () => {
      const content = `[cols="1,1"]
|===
|One, two
|three, four

|One 1, two 2
|three 2, four 2

|One 1, two 3
|three 2, four 3
|===`;
      expect(await translate(content)).toEqual(`[cols="1,1"]
|===
|译One, 译Two
|译Three, 译Four

|译One 1, 译Two 2
|译Three 2, 译Four 2

|译One 1, 译Two 3
|译Three 2, 译Four 3
|===`);
    });
    it('with header', async () => {
      const content = `[%footer,cols="1,1"]
|===
|One, Two |three 2, four

|One 1, two 2
|three 2, four 2

|One 1, two 3
|three 2, four 3
|===`;
      expect(await translate(content)).toEqual(`[%footer,cols="1,1"]
|===
|译One, 译Two |译Three 2, 译Four

|译One 1, 译Two 2
|译Three 2, 译Four 2

|译One 1, 译Two 3
|译Three 2, 译Four 3
|===`);
    });

    xit('AsciiDoc block in cell', async () => {
      const content = `|===
|One |Two

|Three

* Four
* Five
* Six

a|One

* Two
* Three
* Four
|===`;
      expect(await translate(content)).toEqual(`|===
|译One |译Two

|译Three

* 译Four
* 译Five
* 译Six

a|译One

* 译Two
* 译Three
* 译Four
|===`);
    });
    it('col span and row span', async () => {
      const content = `|===
|Column 1, header row |Column 2, header row |Column 3, header row |Column 4, header row

|One, two
2.3+|three
|four

|one, two
|three, four
|===`;
      expect(await translate(content)).toEqual(`|===
|COLUMN 1, HEADER ROW |COLUMN 2, HEADER ROW |COLUMN 3, HEADER ROW |COLUMN 4, HEADER ROW

|译One, 译Two
2.3+|译Three
|译Four

|译One, 译Two
|译Three, 译Four
|===`);
    });

    it('table width', async () => {
      const content = `[%autowidth.stretch]
|===
|Column 1, header row |Column 2, header row |Column 3, header row

|One, Two
|One, Two
|One, Two
|===`;
      expect(await translate(content)).toEqual(`[%autowidth.stretch]
|===
|COLUMN 1, HEADER ROW |COLUMN 2, HEADER ROW |COLUMN 3, HEADER ROW

|译One, 译Two
|译One, 译Two
|译One, 译Two
|===`);
    });
  });
  describe('STEM formula', () => {
    // TODO: 修改 Html5Converter，把公式翻译成不会被翻译的格式。
    xit('inline', async () => {
      const content = `stem:[sqrt(4) = 2]

Water (stem:[H_2O]) is a critical component.`;
      expect(await translate(content)).toEqual(content);
    });
    it('block', async () => {
      const content = `[stem]
++++
sqrt(4) = 2
++++`;
      expect(await translate(content)).toEqual(content);
    });
    it('mixed', async () => {
      const content = `= One
Two <two@example.org>
:stem: latexmath

[asciimath]
++++
sqrt(4) = 2
++++`;
      expect(await translate(content)).toEqual(`= 译One
Two <two@example.org>
:stem: latexmath

[asciimath]
++++
sqrt(4) = 2
++++`);
    });
  });

  describe('open blocks', () => {
    it('simple', async () => {
      const content = `--
one
two
--`;
      expect(await translate(content)).toEqual(`--
译One
译Two
--`);
    });
  });
  describe('escape', () => {
    const title = 'TIP: ';
    it('+', async () => {
      const content = title + 'one `+two.*+` three `+++four.five.*+++`';
      expect(await translate(content)).toEqual('TIP: 译One `two.*` 译Three `four.five.*`');
    });
    it('**', async () => {
      const content = title + '**one**';
      expect(await translate(content)).toEqual(`TIP: *译One*`);
    });
    it('${}', async () => {
      const content = title + '${two}';
      expect(await translate(content)).toEqual('TIP: ${译Two}');
    });
  });
});
