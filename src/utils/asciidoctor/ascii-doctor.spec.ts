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
    const content = `paragraph`;
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
    const content = `[positional_attribute_1,positional_attribute_2,named_attribute=value,positional_attribute_3]
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
  it('ordered list', () => {
    const content = `[start=4,%reversed]
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
});
