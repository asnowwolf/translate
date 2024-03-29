// 必须有这句 import，否则不会合并 `@asciidoctor/core` 中的原有定义
// noinspection ES6UnusedImports
import { Asciidoctor } from '@asciidoctor/core';

declare module '@asciidoctor/core' {
  namespace Asciidoctor {
    import Callout = Asciidoctor.Callout;
    import ListItem = Asciidoctor.ListItem;

    interface AbstractBlock {
      content_model?: string;
    }

    interface Block {
      lines: string[];
    }

    interface RubyMap {
      $$keys: (string | { key: number, key_hash: number, value: string })[];
      $$smap: { [key: string]: any };
    }

    interface AbstractNode {
      attributes: RubyMap;
    }

    namespace Document {
      interface AttributeEntry {
        position?: number;
      }
    }

    interface Document {
      blocks: AbstractBlock[];
      attributes_modified: {
        hash: {
          $$keys: string[];
        }
      };
    }

    interface InlineIndexTermAttributes {
      terms: string[];
    }

    namespace Table {
      interface CellAttributes {
        width: number;
        colnumber: number;
        halign: string;
        valign: string;
        colpcwidth: number;
        style: string;
      }

      type ColumnAttributes = CellAttributes;

      interface Cell {
        text: string;

        style: string;

        getAttributes(): CellAttributes;
      }

      interface Column {
        getAttributes(): ColumnAttributes;
      }
    }

    interface DescriptionList extends AbstractBlock {
      getItems(): DescriptionItem[];
    }

    type DescriptionItem = [[ListItem], ListItem];

    interface Callouts {
      getCurrentList(): Callout[];
    }
  }


  type SubstitutionType = 'specialcharacters' | 'quotes' | 'attributes' | 'replacements' | 'macros' | 'post_replacements' | 'callouts';

  interface Asciidoctor {
    Substitutors: {
      $$const: {
        VERBATIM_SUBS: SubstitutionType[];
        REFTEXT_SUBS: SubstitutionType[];
        NORMAL_SUBS: SubstitutionType[];
        HEADER_SUBS: SubstitutionType[];
        BASIC_SUBS: SubstitutionType[];
      }
    };
    Reader: typeof Asciidoctor.Reader;
    Callouts: typeof Asciidoctor.Callouts;
    Logger: typeof Asciidoctor.Logger;
    MemoryLogger: typeof Asciidoctor.MemoryLogger;
    NullLogger: typeof Asciidoctor.MemoryLogger;
    LoggerFormatter: typeof Asciidoctor.LoggerFormatter;
    LoggerMessage: typeof Asciidoctor.LoggerMessage;
    Timings: typeof Asciidoctor.Timings;
    Document: typeof Asciidoctor.Document;
    AbstractBlock: typeof Asciidoctor.AbstractBlock;
    Section: typeof Asciidoctor.Section;
    Inline: typeof Asciidoctor.Inline;
    Block: typeof Asciidoctor.Block;
    Table: typeof Asciidoctor.Table;
    AbstractNode: typeof Asciidoctor.AbstractNode;
    List: typeof Asciidoctor.List;
    ListItem: typeof Asciidoctor.ListItem;
    Converter: typeof Asciidoctor.Converter;
    Html5Converter: typeof Asciidoctor.Html5Converter;
    ConverterFactory: Asciidoctor.ConverterFactory;
    SyntaxHighlighter: typeof Asciidoctor.SyntaxHighlighter;
    TemplateConverter: typeof Asciidoctor.TemplateConverter;
    TemplateEngine: typeof Asciidoctor.TemplateEngine;
  }
}
