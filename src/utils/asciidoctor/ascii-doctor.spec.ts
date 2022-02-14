import * as asciidoctor from 'asciidoctor.js';
import { AdocConverter } from './adoc-converter/adoc-converter';
import * as globby from 'globby';
import * as path from 'path';
import { readFileSync } from 'fs';

describe('ascii-doctor', function () {
  let adoc;
  beforeAll(() => {
    adoc = asciidoctor();
    adoc.ConverterFactory.register(new AdocConverter(), ['html5']);
  });

  function rebuild(content: string): string {
    const dom = adoc.load(content);
    const text = dom.convert();
    return text.trim();
  }

  xit(`e2e`, () => {
    const files = globby.sync(path.join(__dirname, 'samples/**/*.adoc'));
    files.forEach((file) => {
      console.log('converting', file);
      const content = readFileSync(file, 'utf8');
      expect(rebuild(content)).toEqual(content);
    });
  });
  it('paragraph', () => {
    const content = `paragraph1

paragraph2`;
    expect(rebuild(content)).toEqual(content);
  });
  it('Document header', () => {
    const content = `= Document Title
Kismet R. Lee <kismet@asciidoctor.org>
:description: The document's description.
:sectanchors:
:url-repo: https://my-git-repo.com`;
    expect(rebuild(content)).toEqual(content);
  });
  it('section title', () => {
    const content = `== Section Title`;
    expect(rebuild(content)).toEqual(content);
  });
  it('section - complex', () => {
    const content = `[positional_attribute_1, positional_attribute_2, named_attribute=value, positional_attribute_3]
.Kizmet's Favorite Authors
=== Section Title`;
    expect(rebuild(content)).toEqual(content);
  });
  it('index term', () => {
    const content = `I, King Arthur.
(((knight, "Arthur, King")))`;
    expect(rebuild(content)).toEqual(content);
  });
  it('index term - complex', () => {
    const content = `=== Create a new Git repository

(((Repository, create)))
(((Create Git repository)))
To create a new git repository,`;
    expect(rebuild(content)).toEqual(content);
  });
  it('index term2', () => {
    const content = `((abc, def)) ghi`;
    expect(rebuild(content)).toEqual(content);
  });
  it('breaks', () => {
    expect(rebuild(`'''`)).toEqual(`'''`);
    expect(rebuild(`---`)).toEqual(`'''`);
    expect(rebuild(`- - -`)).toEqual(`'''`);
    expect(rebuild(`***`)).toEqual(`'''`);
    expect(rebuild(`* * *`)).toEqual(`'''`);
    const content = `<<<`;
    expect(rebuild(content)).toEqual(content);
  });
  it('unordered list', () => {
    const content = `* [ ] Edgar Allan Poe
** Sheri S. Tepper
* [x] Bill Bryson`;
    expect(rebuild(content)).toEqual(content);
  });

  it('unordered list - complex', () => {
    const content = `abc

* [ ] Edgar Allan Poe
** Sheri S. Tepper
* [x] Bill Bryson

def`;
    expect(rebuild(content)).toEqual(content);
  });

  it('ordered list', () => {
    const content = `[start=4, %reversed]
.Title
. Step four
. Step five
. Step six`;
    expect(rebuild(content)).toEqual(content);
  });
  it('mixed list', () => {
    const content = `. Linux
* Fedora
* Ubuntu
* Slackware
. BSD
* FreeBSD
* NetBSD`;
    expect(rebuild(content)).toEqual(content);
  });
  it('description lists - simple', () => {
    const content = `CPU:: The brain of the computer.
Hard drive:: Permanent storage for operating system and/or user files.
Mouse:: A device that provides input to a computer.
Monitor:: Displays information in visual form using text and graphics.`;
    expect(rebuild(content)).toEqual(content);
  });

  it('description lists - complex', () => {
    const content = `Dairy::
* Milk
* Eggs
Bakery::
* Bread
Produce::
* Bananas`;
    expect(rebuild(content)).toEqual(content);
  });

  describe('text formats', function () {
    it('simple', () => {
      const content = `That is *strong* _emphasis_ \`monospace\` #highlight# ~sub~ ^sup^ **unconstrained strong** stuff!`;
      const rebuilt = `That is *strong* _emphasis_ \`monospace\` #highlight# ~sub~ ^sup^ *unconstrained strong* stuff!`;
      expect(rebuild(content)).toEqual(rebuilt);
    });

    it('mixed', () => {
      const content = '`*_monospace bold italic phrase_*` & ``*__char__*``acter``*__s__*``';
      const rebuilt = '`*_monospace bold italic phrase_*` &amp; `*_char_*`acter`*_s_*`';
      expect(rebuild(content)).toEqual(rebuilt);
    });

    xit('literal monospace', () => {
      const content = `You can reference the value of a document attribute using
the syntax \`+{name}+\`, where  is the attribute name.`;
      const rebuilt = `You can reference the value of a document attribute using
the syntax \`+{name}+\`, where  is the attribute name.`;
      expect(rebuild(content)).toEqual(rebuilt);
    });

    xit('text span', () => {
      const content = `The text [.underline]#underline me# is underlined.`;
      expect(rebuild(content)).toEqual(content);
    });
  });

  describe('links', () => {
    it('autolinks', () => {
      const content = `The homepage for the Asciidoctor Project is https://www.asciidoctor.org.
Email us at hello@example.com to say hello.`;
      expect(rebuild(content)).toEqual(content);
    });

    it('enclosed link', () => {
      const content = `You will often see https://example.org used in examples.`;
      expect(rebuild(content)).toEqual(content);
    });

    xit('no autolink', () => {
      const content = `Once launched, the site will be available at \\https://example.org.

If you cannot access the site, email \\help@example.org for assistance.`;
      expect(rebuild(content)).toEqual(content);
    });
    it('url macro', () => {
      const content = `Chat with other Asciidoctor users on the https://discuss.asciidoctor.org/[*mailing list*^, role=green].`;
      expect(rebuild(content)).toEqual(content);
    });

    xit('complex', () => {
      const content = `= Document Title
:link-with-underscores: https://asciidoctor.org/now_this__link_works.html

This URL has repeating underscores {link-with-underscores}.`;
      expect(rebuild(content)).toEqual(content);
    });
  });
  describe('cross references', () => {
    it('simple', () => {
      const content = `The section <<anchors>> describes how automatic anchors work.`;
      expect(rebuild(content)).toEqual(content);
    });
    it('complex', () => {
      const content = `Learn how to <<link-macro-attributes,use attributes within the link macro>>.`;
      expect(rebuild(content)).toEqual(content);
    });
    it('nature', () => {
      const content = `Refer to <<Internal Cross References>>.`;
      expect(rebuild(content)).toEqual(content);
    });
    it('cross document', () => {
      const content = `Refer to <<document-b.adoc#section-b,Section B>> for more information.`;
      const rebulit = `Refer to <<document-b.html#section-b,Section B>> for more information.`;
      expect(rebuild(content)).toEqual(rebulit);
    });
    it('footnotes', () => {
      const content = `The hail-and-rainbow protocol can be initiated at five levels:

doublefootnote:[The double hail-and-rainbow level makes my toes tingle.]

A bold statement!footnote:disclaimer[Opinions are my own.]

Another outrageous statement.footnote:disclaimer[]`;
      expect(rebuild(content)).toEqual(content);
    });
  });
  describe('resources', () => {
    it('images - block', () => {
      const content = `image::sunset.jpg["Mesa Verde Sunset, by JAVH"]`;
      expect(rebuild(content)).toEqual(content);
    });

    it('images - inline', () => {
      const content = `Click image:play.png[] to get the party started.

Click image:pause.png[Pause] when you need a break.`;
      expect(rebuild(content)).toEqual(content);
    });

    it('image with attributes', () => {
      const content = `[#img-sunset, link=https://www.flickr.com/photos/javh/5448336655]
.A mountain sunset
image::sunset.jpg[Sunset, 200, 100]`;
      expect(rebuild(content)).toEqual(content);
    });

    it('image with attributes 2', () => {
      const content = `image::tiger.png[Tiger, 200, 200, float=right, align=center]`;
      expect(rebuild(content)).toEqual(content);
    });

    it('audio and video', () => {
      const content = `video::tiger.mp4[Tiger, 200, 200, float=right, align=center]`;
      expect(rebuild(content)).toEqual(content);
    });

    it('icon', () => {
      const content = `icon:download[link=https://rubygems.org/downloads/whizbang-1.0.0.gem, window=_blank]`;
      expect(rebuild(content)).toEqual(content);
    });
  });
  describe('macros', () => {
    it('keyboard macro', () => {
      const content = `:experimental:
the hortkey is kbd:[Ctrl+F11]`;
      expect(rebuild(content)).toEqual(content);
    });
    it('button macro', () => {
      const content = `:experimental:
Press the btn:[OK] button when you are finished.

Select a file in the file navigator and click btn:[Open].`;
      expect(rebuild(content)).toEqual(content);
    });
    it('menu macro', () => {
      const content = `:experimental:
To save the file, select menu:File[Save].

Select menu:View[Zoom > Reset] to reset the zoom level to the default setting.`;
      expect(rebuild(content)).toEqual(content);
    });
  });
  describe('admonitions', () => {
    it('simple', () => {
      const content = `abc

WARNING: Wolpertingers are known to nest in server racks.
Enter at your own risk.`;
      expect(rebuild(content)).toEqual(content);
    });
    it('complex', () => {
      const content = `[IMPORTANT]
.Feeding the Werewolves
====
While werewolves are hardy community members, keep in mind the following dietary concerns:

. They are allergic to cinnamon.
. More than two glasses of orange juice in 24 hours makes them howl in harmony with alarms and sirens.
. Celery makes them sad.
====`;
      expect(rebuild(content)).toEqual(content);
    });
  });

  describe('sidebar', () => {
    it('simple', () => {
      const content = `[sidebar]
Sidebars are used to visually separate auxiliary bits of content
that supplement the main text.`;
      expect(rebuild(content)).toEqual(content);
    });

    it('complex', () => {
      const content = `.Optional Title
****
Sidebars are used to visually separate auxiliary bits of content
that supplement the main text.

TIP: They can contain any type of content.
****`;
      expect(rebuild(content)).toEqual(content);
    });
  });
  describe('example blocks', () => {
    it('simple', () => {
      const content = `[example]
.Optional title
This is an example of an example block.`;
      expect(rebuild(content)).toEqual(content);
    });

    it('complex', () => {
      const content = `.Onomatopoeia
====
The book hit the floor with a *thud*.

He could hear doves *cooing* in the pine trees branches.
====`;
      expect(rebuild(content)).toEqual(content);
    });
  });

  describe('blockquotes', function () {
    it('simple', function () {
      const content = `[quote, Captain James T. Kirk, Star Trek IV: The Voyage Home]
.After landing the cloaked Klingon bird of prey in Golden Gate park:
Everybody remember where we parked.`;
      expect(rebuild(content)).toEqual(content);
    });
    it('syntax highlight', () => {
      const content = `[quote, Monty Python and the Holy Grail]
____
Dennis: Come and see the violence inherent in the system.

King Arthur: Bloody peasant!

Dennis: Oh, what a giveaway!
____`;
      expect(rebuild(content)).toEqual(content);
    });

    it('shorthand', () => {
      const content = `"I hold it that a little rebellion now and then is a good thing,
and as necessary in the political world as storms in the physical."
-- Thomas Jefferson, Papers of Thomas Jefferson: Volume 11`;
      expect(rebuild(content)).toEqual(content);
    });

    it('markdown', () => {
      const content = `> > What's new?
>
> I've got Markdown in my AsciiDoc!
>
> > Like what?
>
> * Blockquotes
> * Headings
> * Fenced code blocks
>
> > Is there more?
>
> Yep. AsciiDoc and Markdown share a lot of common syntax already.`;
      const rebuilt = `[style=quote]
____
[style=quote]
____
What&#8217;s new?
____
I&#8217;ve got Markdown in my AsciiDoc!

[style=quote]
____
Like what?
____
* Blockquotes
* Headings
* Fenced code blocks

[style=quote]
____
Is there more?
____
Yep. AsciiDoc and Markdown share a lot of common syntax already.
____`;
      expect(rebuild(content)).toEqual(rebuilt);
    });

  });
  it('verse', () => {
    const content = `[verse, Carl Sandburg, two lines from the poem Fog]
The fog comes
on little cat feet.`;
    expect(rebuild(content)).toEqual(content);
  });
  describe('source code blocks', () => {
    it('simple', () => {
      const content = `[source, ruby]
----
require 'sinatra'

get '/hi' do
  "Hello World!"
end
----`;
      expect(rebuild(content)).toEqual(content);
    });
  });
});
