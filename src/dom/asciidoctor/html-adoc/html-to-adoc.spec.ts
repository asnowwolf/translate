import { htmlToAdoc } from './html-to-adoc';
import { adocToHtml } from './adoc-to-html';

function rebuild(input: string): string {
  return htmlToAdoc(adocToHtml(input));
}

describe('html-to-adoc', () => {
  it('plain text', () => {
    const input = `paragraph`;
    expect(rebuild(input)).toEqual(input);
  });
  describe('quoted', () => {
    it('Constrained strong', () => {
      const input = `*paragraph*`;
      expect(rebuild(input)).toEqual(input);
    });
    it('Unconstrained strong', () => {
      const input = `**para**graph`;
      expect(rebuild(input)).toEqual(input);
    });
    it('Constrained code', () => {
      const input = `_paragraph_`;
      expect(rebuild(input)).toEqual(input);
    });
    it('Unconstrained code', () => {
      const input = `__para__graph`;
      expect(rebuild(input)).toEqual(input);
    });
    it('Constrained code', () => {
      const input = '`paragraph`';
      expect(rebuild(input)).toEqual(input);
    });
    it('Unconstrained code', () => {
      const input = '``para``graph';
      expect(rebuild(input)).toEqual(input);
    });
    it('Constrained highlight', () => {
      const input = '#paragraph#';
      expect(rebuild(input)).toEqual(input);
    });
    it('Unconstrained highlight', () => {
      const input = '##para##graph';
      expect(rebuild(input)).toEqual(input);
    });
    it('Constrained superscript', () => {
      const input = '^paragraph^';
      expect(rebuild(input)).toEqual(input);
    });
    it('Constrained subscript', () => {
      const input = '~paragraph~';
      expect(rebuild(input)).toEqual(input);
    });
  });
  describe('text formats', () => {
    it('simple', () => {
      const content = `*one* _two_ \`three\` #four# ~five~ ^six^ *se*ven eight`;
      expect(rebuild(content)).toEqual(content);
    });

    it('mixed', () => {
      const content = '`*_one two_*` & ``*__th__ree*``four``**fi**ve``';
      expect(rebuild(content)).toEqual(content);
    });

    it('literal monospace', () => {
      const content = `You can reference the value of a document attribute using
the syntax \`{name}\`, where  is the attribute name.`;
      expect(rebuild(content)).toEqual(content);
    });

    it('text span', () => {
      const content = `The text [.underline]#underline me# is underlined.`;
      expect(rebuild(content)).toEqual(content);
    });
  });
  describe('inline anchor', () => {
    it('inline anchor', () => {
      const input = 'Learn how to <<link-macro-attributes,use attributes within the link macro>>.';
      expect(rebuild(input)).toEqual(input);
    });
    it('cross references', () => {
      const input = 'Refer to <<Internal Cross References>>.';
      expect(rebuild(input)).toEqual(input);
    });
    it('cross document references', () => {
      const input = 'Refer to xref:document-b.adoc#section-b[Section B] for more information.';
      expect(rebuild(input)).toEqual(input);
    });
  });
  it('inline breaks', () => {
    const input = `Rubies are red, +
Topazes are blue.`;
    expect(rebuild(input)).toEqual(input);
  });
  describe('inline macros', () => {

    it('button macro', () => {
      const content = `Press the btn:[OK] button when you are finished.`;
      expect(rebuild(content)).toEqual(content);
    });
    it('menu macro', () => {
      const content = `Select menu:View[Zoom > Reset > Reset 1] to reset the zoom level to the default setting.`;
      expect(rebuild(content)).toEqual(content);
    });
    it('keyboard macro', () => {
      const content = `kbd:[Ctrl+Shift+N]`;
      expect(rebuild(content)).toEqual(content);
    });
  });
  describe('resources', () => {
    it('images - inline', () => {
      const content = `Click image:pause.png[Pause] when you need a break.`;
      expect(rebuild(content)).toEqual(content);
    });
    it('icon with window', () => {
      const content = `icon:download[link=https://rubygems.org/downloads/whizbang-1.0.0.gem,window=_blank]`;
      expect(rebuild(content)).toEqual(content);
    });
    it('icon without window', () => {
      const content = `icon:download[link=https://rubygems.org/downloads/whizbang-1.0.0.gem]`;
      expect(rebuild(content)).toEqual(content);
    });
  });
});
