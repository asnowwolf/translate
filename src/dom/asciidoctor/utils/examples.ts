export class Examples {
  static readonly documentAdoc = `= Document Title
Kismet R. Lee <kismet@asciidoctor.org>; B. Steppenwolf
v1.0.0, 2020-01-01
:description: The document's description.
:sectanchors:
:url-repo: https://my-git-repo.com`;
  static readonly documentAdocCn = `= 译Document Title
Kismet R. Lee <kismet@asciidoctor.org>; B. Steppenwolf
v1.0.0, 2020-01-01
:description: 译The document's description.
:sectanchors:
:url-repo: https://my-git-repo.com`;
  static readonly documentHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="generator" content="Asciidoctor 2.0.17">
<meta name="description" content="The document's description.">
<meta name="author" content="Kismet R. Lee, B. Steppenwolf">
<title>Document Title</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:300,300italic,400,400italic,600,600italic%7CNoto+Serif:400,400italic,700,700italic%7CDroid+Sans+Mono:400,700">
<link rel="stylesheet" href="./asciidoctor.css">
</head>
<body class="article">
<div id="header">
<h1>Document Title</h1>
<div class="details">
<span id="author" class="author">Kismet R. Lee</span><br>
<span id="email" class="email"><a href="mailto:kismet@asciidoctor.org">kismet@asciidoctor.org</a></span><br>
<span id="author2" class="author">B. Steppenwolf</span><br>
<span id="revnumber">version 1.0.0,</span>
<span id="revdate">2020-01-01</span>
</div>
</div>
<div id="content">

</div>
<div id="footer">
<div id="footer-text">
Version 1.0.0<br>
Last updated 2000-01-01 00:00:00 +0000
</div>
</div>
</body>
</html>`;
  static readonly documentTiny = `<article adoc-name="document" data-doctitle="Document Title" data-authorcount="2" type-data-authorcount="number" data-firstname="Kismet" data-authorinitials="KRL" data-middlename="R." data-lastname="Lee" data-author="Kismet R. Lee" data-email="kismet@asciidoctor.org" data-authors="Kismet R. Lee, B. Steppenwolf" data-firstname_2="B." data-authorinitials_2="BS" data-lastname_2="Steppenwolf" data-author_2="B. Steppenwolf" data-author_1="Kismet R. Lee" data-authorinitials_1="KRL" data-firstname_1="Kismet" data-middlename_1="R." data-lastname_1="Lee" data-email_1="kismet@asciidoctor.org" data-revnumber="1.0.0" data-revdate="2020-01-01" data-description="The document's description." data-sectanchors="" data-url-repo="https://my-git-repo.com"></article>`;
  static readonly documentNormalized = this.documentAdoc;
  static readonly documentWithPreambleAdoc = `= Document Title

Preamble paragraph

== Section title`;
  static readonly documentWithPreambleAdocCn = `= 译Document Title

译Preamble paragraph

== 译Section title`;
  static readonly documentWithPreambleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="generator" content="Asciidoctor 2.0.17">
<title>Document Title</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:300,300italic,400,400italic,600,600italic%7CNoto+Serif:400,400italic,700,700italic%7CDroid+Sans+Mono:400,700">
<link rel="stylesheet" href="./asciidoctor.css">
</head>
<body class="article">
<div id="header">
<h1>Document Title</h1>
</div>
<div id="content">
<div id="preamble">
<div class="sectionbody">
<div class="paragraph">
<p>Preamble paragraph</p>
</div>
</div>
</div>
<div class="sect1">
<h2 id="_section_title">Section title</h2>
<div class="sectionbody">

</div>
</div>
</div>
<div id="footer">
<div id="footer-text">
Last updated 2000-01-01 00:00:00 +0000
</div>
</div>
</body>
</html>`;
  static readonly documentWithPreambleTiny = `<article adoc-name="document" data-doctitle="Document Title"><summary adoc-name="preamble"><p adoc-name="paragraph">Preamble paragraph</p></summary><section adoc-name="section" attr-Level="1" type-attr-Level="number" attr-SectionName="section" attr-Title="Section title" attr-Id="_section_title"></section></article>`;
  static readonly documentWithPreambleNormalized = this.documentWithPreambleAdoc;
  static readonly paragraphAdoc = `paragraph1

paragraph2`;
  static readonly paragraphAdocCn = `译paragraph1

译paragraph2`;
  static readonly paragraphHtml = `<div class="paragraph">
<p>paragraph1</p>
</div>
<div class="paragraph">
<p>paragraph2</p>
</div>`;
  static readonly paragraphTiny = `<article adoc-name="document"><p adoc-name="paragraph">paragraph1</p><p adoc-name="paragraph">paragraph2</p></article>`;
  static readonly paragraphNormalized = this.paragraphAdoc;
  static readonly sectionSimpleAdoc = `== Section Title`;
  static readonly sectionSimpleAdocCn = `== 译Section Title`;
  static readonly sectionSimpleHtml = `<div class="sect1">
<h2 id="_section_title">Section Title</h2>
<div class="sectionbody">

</div>
</div>`;
  static readonly sectionSimpleTiny = `<article adoc-name="document"><section adoc-name="section" attr-Level="1" type-attr-Level="number" attr-SectionName="section" attr-Title="Section Title" attr-Id="_section_title"></section></article>`;
  static readonly sectionSimpleNormalized = this.sectionSimpleAdoc;
  static readonly floatingTitleAdoc = `[discrete]
== Floating Title`;
  static readonly floatingTitleAdocCn = `[discrete]
== 译Floating Title`;
  static readonly floatingTitleHtml = `<h2 id="_floating_title" class="discrete">Floating Title</h2>`;
  static readonly floatingTitleTiny = `<article adoc-name="document"><h2 adoc-name="floating_title" attr-Title="Floating Title" attr-Style="discrete" attr-Id="_floating_title">Floating Title</h2></article>`;
  static readonly floatingTitleNormalized = this.floatingTitleAdoc;
  static readonly sectionWithTitleAndAttributesAdoc = `[positional_attribute_1,positional_attribute_2,named_attribute=value,positional_attribute_3]
.Kizmet's Favorite Authors
=== Section Title`;
  static readonly sectionWithTitleAndAttributesAdocCn = `[positional_attribute_1,positional_attribute_2,named_attribute=value,positional_attribute_3]
.译Kizmet's Favorite Authors
=== 译Section Title`;
  static readonly sectionWithTitleAndAttributesHtml = `<div class="sect2">
<h3 id="_section_title">Section Title</h3>

</div>`;
  static readonly sectionWithTitleAndAttributesTiny = `<article adoc-name="document"><section adoc-name="section" attr-Level="2" type-attr-Level="number" attr-SectionName="positional_attribute_1" attr-Title="Section Title" attr-Id="_section_title" data-named_attribute="value" data-title="Kizmet's Favorite Authors"></section></article>`;
  static readonly sectionWithTitleAndAttributesNormalized = this.sectionWithTitleAndAttributesAdoc;
  static readonly indexTermBlockSimpleAdoc = `I, King Arthur.
(((knight, "Arthur, King")))`;
  static readonly indexTermBlockSimpleAdocCn = `译I, King Arthur.
(((译knight, "译Arthur, King")))`;
  static readonly indexTermBlockSimpleHtml = `<div class="paragraph">
<p>I, King Arthur.
</p>
</div>`;
  static readonly indexTermBlockSimpleTiny = `<article adoc-name="document"><p adoc-name="paragraph">I, King Arthur.
<a adoc-name="inline_indexterm" prop-alt=""><span class="term">knight</span><span class="term">Arthur, King</span></a></p></article>`;
  static readonly indexTermBlockSimpleNormalized = this.indexTermBlockSimpleAdoc;
  static readonly indexTermBlockComplexAdoc = `=== Create a new Git repository

(((Repository, create)))
(((Create Git repository)))
To create a new git repository,`;
  static readonly indexTermBlockComplexAdocCn = `=== 译Create a new Git repository

(((译Repository, 译create)))
(((译Create Git repository)))
译To create a new git repository,`;
  static readonly indexTermBlockComplexHtml = `<div class="sect2">
<h3 id="_create_a_new_git_repository">Create a new Git repository</h3>
<div class="paragraph">
<p>

To create a new git repository,</p>
</div>
</div>`;
  static readonly indexTermBlockComplexTiny = `<article adoc-name="document"><section adoc-name="section" attr-Level="2" type-attr-Level="number" attr-SectionName="section" attr-Title="Create a new Git repository" attr-Id="_create_a_new_git_repository"><p adoc-name="paragraph"><a adoc-name="inline_indexterm" prop-alt=""><span class="term">Repository</span><span class="term">create</span></a><a adoc-name="inline_indexterm" prop-alt=""><span class="term">Create Git repository</span></a>
To create a new git repository,</p></section></article>`;
  static readonly indexTermBlockComplexNormalized = this.indexTermBlockComplexAdoc;
  static readonly indexTermInlineAdoc = `((abc, def)) ghi`;
  static readonly indexTermInlineAdocCn = `((译abc, 译def))译 ghi`;
  static readonly indexTermInlineHtml = `<div class="paragraph">
<p>abc, def ghi</p>
</div>`;
  static readonly indexTermInlineTiny = `<article adoc-name="document"><p adoc-name="paragraph"><a adoc-name="inline_indexterm" prop-type="visible" prop-alt=""><span class="term">abc</span><span class="term">def</span></a> ghi</p></article>`;
  static readonly indexTermInlineNormalized = this.indexTermInlineAdoc;
  static readonly breakThematic1Adoc = `'''`;
  static readonly breakThematic1AdocCn = `'''`;
  static readonly breakThematic1Html = `<hr>`;
  static readonly breakThematic1Tiny = `<article adoc-name="document"><hr adoc-name="thematic_break"/></article>`;
  static readonly breakThematic1Normalized = this.breakThematic1Adoc;
  static readonly breakThematic2Adoc = `---`;
  static readonly breakThematic2AdocCn = `---`;
  static readonly breakThematic2Html = `<hr>`;
  static readonly breakThematic2Tiny = Examples.breakThematic1Tiny;
  static readonly breakThematic2Normalized = `'''`;
  static readonly breakThematic3Adoc = `- - -`;
  static readonly breakThematic3AdocCn = `- - -`;
  static readonly breakThematic3Html = `<hr>`;
  static readonly breakThematic3Tiny = Examples.breakThematic1Tiny;
  static readonly breakThematic3Normalized = `'''`;
  static readonly breakThematic4Adoc = `***`;
  static readonly breakThematic4AdocCn = `***`;
  static readonly breakThematic4Html = `<hr>`;
  static readonly breakThematic4Tiny = Examples.breakThematic1Tiny;
  static readonly breakThematic4Normalized = `'''`;
  static readonly breakThematic5Adoc = `* * *`;
  static readonly breakThematic5AdocCn = `* * *`;
  static readonly breakThematic5Html = `<hr>`;
  static readonly breakThematic5Tiny = Examples.breakThematic1Tiny;
  static readonly breakThematic5Normalized = `'''`;
  static readonly breakPageAdoc = `<<<`;
  static readonly breakPageAdocCn = `<<<`;
  static readonly breakPageHtml = `<div style="page-break-after: always;"></div>`;
  static readonly breakPageTiny = `<article adoc-name="document"><hr adoc-name="page_break"/></article>`;
  static readonly breakPageNormalized = this.breakPageAdoc;
  static readonly unorderedListSimpleAdoc = `* [ ] Edgar Allan Poe
** Sheri S. Tepper
* [x] Bill Bryson`;
  static readonly unorderedListSimpleAdocCn = `* [ ] 译Edgar Allan Poe
** 译Sheri S. Tepper
* [x] 译Bill Bryson`;
  static readonly unorderedListSimpleHtml = `<div class="ulist checklist">
<ul class="checklist">
<li>
<p>&#10063; Edgar Allan Poe</p>
<div class="ulist">
<ul>
<li>
<p>Sheri S. Tepper</p>
</li>
</ul>
</div>
</li>
<li>
<p>&#10003; Bill Bryson</p>
</li>
</ul>
</div>`;
  static readonly unorderedListSimpleTiny = `<article adoc-name="document"><ul adoc-name="ulist" data-checklist-option=""><li adoc-name="list_item" attr-Text="Edgar Allan Poe" attr-Marker="*" data-checkbox="">Edgar Allan Poe<ul adoc-name="ulist"><li adoc-name="list_item" attr-Text="Sheri S. Tepper" attr-Marker="**">Sheri S. Tepper</li></ul></li><li adoc-name="list_item" attr-Text="Bill Bryson" attr-Marker="*" data-checkbox="" data-checked="">Bill Bryson</li></ul></article>`;
  static readonly unorderedListSimpleNormalized = this.unorderedListSimpleAdoc;
  static readonly unorderedListWithParagraphsAdoc = `abc

* [ ] Edgar Allan Poe
** Sheri S. Tepper
* [x] Bill Bryson

def`;
  static readonly unorderedListWithParagraphsAdocCn = `译abc

* [ ] 译Edgar Allan Poe
** 译Sheri S. Tepper
* [x] 译Bill Bryson

译def`;
  static readonly unorderedListWithParagraphsHtml = `<div class="paragraph">
<p>abc</p>
</div>
<div class="ulist checklist">
<ul class="checklist">
<li>
<p>&#10063; Edgar Allan Poe</p>
<div class="ulist">
<ul>
<li>
<p>Sheri S. Tepper</p>
</li>
</ul>
</div>
</li>
<li>
<p>&#10003; Bill Bryson</p>
</li>
</ul>
</div>
<div class="paragraph">
<p>def</p>
</div>`;
  static readonly unorderedListWithParagraphsTiny = `<article adoc-name="document"><p adoc-name="paragraph">abc</p><ul adoc-name="ulist" data-checklist-option=""><li adoc-name="list_item" attr-Text="Edgar Allan Poe" attr-Marker="*" data-checkbox="">Edgar Allan Poe<ul adoc-name="ulist"><li adoc-name="list_item" attr-Text="Sheri S. Tepper" attr-Marker="**">Sheri S. Tepper</li></ul></li><li adoc-name="list_item" attr-Text="Bill Bryson" attr-Marker="*" data-checkbox="" data-checked="">Bill Bryson</li></ul><p adoc-name="paragraph">def</p></article>`;
  static readonly unorderedListWithParagraphsNormalized = this.unorderedListWithParagraphsAdoc;
  static readonly orderedListAdoc = `[start=4,%reversed]
.Title
. Step four
.. Step four-one
.. Step four-two
... Step four-two-one
.... Step four-two-one-one
..... Step four-two-one-one-one
...... Step four-two-one-one-one-one
....... Step four-two-one-one-one-one-one
. Step five
. Step six`;
  static readonly orderedListAdocCn = `[start=4,%reversed]
.译Title
. 译Step four
.. 译Step four-one
.. 译Step four-two
... 译Step four-two-one
.... 译Step four-two-one-one
..... 译Step four-two-one-one-one
...... 译Step four-two-one-one-one-one
....... 译Step four-two-one-one-one-one-one
. 译Step five
. 译Step six`;
  static readonly orderedListHtml = `<div class="olist arabic">
<div class="title">Title</div>
<ol class="arabic" start="4">
<li>
<p>Step four</p>
<div class="olist loweralpha">
<ol class="loweralpha" type="a">
<li>
<p>Step four-one</p>
</li>
<li>
<p>Step four-two</p>
<div class="olist lowerroman">
<ol class="lowerroman" type="i">
<li>
<p>Step four-two-one</p>
<div class="olist upperalpha">
<ol class="upperalpha" type="A">
<li>
<p>Step four-two-one-one</p>
<div class="olist upperroman">
<ol class="upperroman" type="I">
<li>
<p>Step four-two-one-one-one</p>
<div class="olist arabic">
<ol class="arabic">
<li>
<p>Step four-two-one-one-one-one</p>
<div class="olist arabic">
<ol class="arabic">
<li>
<p>Step four-two-one-one-one-one-one</p>
</li>
</ol>
</div>
</li>
</ol>
</div>
</li>
</ol>
</div>
</li>
</ol>
</div>
</li>
</ol>
</div>
</li>
</ol>
</div>
</li>
<li>
<p>Step five</p>
</li>
<li>
<p>Step six</p>
</li>
</ol>
</div>`;
  static readonly orderedListTiny = `<article adoc-name="document"><ol adoc-name="olist" attr-Title="Title" attr-Style="arabic" data-start="4"><li adoc-name="list_item" attr-Text="Step four" attr-Marker=".">Step four<ol adoc-name="olist" attr-Style="loweralpha"><li adoc-name="list_item" attr-Text="Step four-one" attr-Marker="..">Step four-one</li><li adoc-name="list_item" attr-Text="Step four-two" attr-Marker="..">Step four-two<ol adoc-name="olist" attr-Style="lowerroman"><li adoc-name="list_item" attr-Text="Step four-two-one" attr-Marker="...">Step four-two-one<ol adoc-name="olist" attr-Style="upperalpha"><li adoc-name="list_item" attr-Text="Step four-two-one-one" attr-Marker="....">Step four-two-one-one<ol adoc-name="olist" attr-Style="upperroman"><li adoc-name="list_item" attr-Text="Step four-two-one-one-one" attr-Marker=".....">Step four-two-one-one-one<ol adoc-name="olist" attr-Style="arabic"><li adoc-name="list_item" attr-Text="Step four-two-one-one-one-one" attr-Marker="......">Step four-two-one-one-one-one<ol adoc-name="olist" attr-Style="arabic"><li adoc-name="list_item" attr-Text="Step four-two-one-one-one-one-one" attr-Marker=".......">Step four-two-one-one-one-one-one</li></ol></li></ol></li></ol></li></ol></li></ol></li></ol></li><li adoc-name="list_item" attr-Text="Step five" attr-Marker=".">Step five</li><li adoc-name="list_item" attr-Text="Step six" attr-Marker=".">Step six</li></ol></article>`;
  static readonly orderedListNormalized = this.orderedListAdoc;
  static readonly mixedListAdoc = `. Linux
* Fedora
* Ubuntu
* Slackware
. BSD
* FreeBSD
* NetBSD`;
  static readonly mixedListAdocCn = `. 译Linux
* 译Fedora
* 译Ubuntu
* 译Slackware
. BSD
* 译FreeBSD
* 译NetBSD`;
  static readonly mixedListHtml = `<div class="olist arabic">
<ol class="arabic">
<li>
<p>Linux</p>
<div class="ulist">
<ul>
<li>
<p>Fedora</p>
</li>
<li>
<p>Ubuntu</p>
</li>
<li>
<p>Slackware</p>
</li>
</ul>
</div>
</li>
<li>
<p>BSD</p>
<div class="ulist">
<ul>
<li>
<p>FreeBSD</p>
</li>
<li>
<p>NetBSD</p>
</li>
</ul>
</div>
</li>
</ol>
</div>`;
  static readonly mixedListTiny = `<article adoc-name="document"><ol adoc-name="olist" attr-Style="arabic"><li adoc-name="list_item" attr-Text="Linux" attr-Marker=".">Linux<ul adoc-name="ulist"><li adoc-name="list_item" attr-Text="Fedora" attr-Marker="*">Fedora</li><li adoc-name="list_item" attr-Text="Ubuntu" attr-Marker="*">Ubuntu</li><li adoc-name="list_item" attr-Text="Slackware" attr-Marker="*">Slackware</li></ul></li><li adoc-name="list_item" attr-Text="BSD" attr-Marker=".">BSD<ul adoc-name="ulist"><li adoc-name="list_item" attr-Text="FreeBSD" attr-Marker="*">FreeBSD</li><li adoc-name="list_item" attr-Text="NetBSD" attr-Marker="*">NetBSD</li></ul></li></ol></article>`;
  static readonly mixedListNormalized = this.mixedListAdoc;
  static readonly descriptionListSimpleAdoc = `CPU:: The brain of the computer.
Hard drive:: Permanent storage for operating system and/or user files.
Mouse:: A device that provides input to a computer.
Monitor:: Displays information in visual form using text and graphics.`;
  static readonly descriptionListSimpleAdocCn = `CPU:: 译The brain of the computer.
译Hard drive:: 译Permanent storage for operating system and/or user files.
译Mouse:: 译A device that provides input to a computer.
译Monitor:: 译Displays information in visual form using text and graphics.`;
  static readonly descriptionListSimpleHtml = `<div class="dlist">
<dl>
<dt class="hdlist1">CPU</dt>
<dd>
<p>The brain of the computer.</p>
</dd>
<dt class="hdlist1">Hard drive</dt>
<dd>
<p>Permanent storage for operating system and/or user files.</p>
</dd>
<dt class="hdlist1">Mouse</dt>
<dd>
<p>A device that provides input to a computer.</p>
</dd>
<dt class="hdlist1">Monitor</dt>
<dd>
<p>Displays information in visual form using text and graphics.</p>
</dd>
</dl>
</div>`;
  static readonly descriptionListSimpleTiny = `<article adoc-name="document"><dl adoc-name="dlist"><dt>CPU</dt><dd>The brain of the computer.</dd><dt>Hard drive</dt><dd>Permanent storage for operating system and/or user files.</dd><dt>Mouse</dt><dd>A device that provides input to a computer.</dd><dt>Monitor</dt><dd>Displays information in visual form using text and graphics.</dd></dl></article>`;
  static readonly descriptionListSimpleNormalized = this.descriptionListSimpleAdoc;
  static readonly descriptionListComplexAdoc = `Dairy::
* Milk
* Eggs
Bakery::
* Bread
Produce::
* Bananas`;
  static readonly descriptionListComplexAdocCn = `译Dairy::
* 译Milk
* 译Eggs
译Bakery::
* 译Bread
译Produce::
* 译Bananas`;
  static readonly descriptionListComplexHtml = `<div class="dlist">
<dl>
<dt class="hdlist1">Dairy</dt>
<dd>
<div class="ulist">
<ul>
<li>
<p>Milk</p>
</li>
<li>
<p>Eggs</p>
</li>
</ul>
</div>
</dd>
<dt class="hdlist1">Bakery</dt>
<dd>
<div class="ulist">
<ul>
<li>
<p>Bread</p>
</li>
</ul>
</div>
</dd>
<dt class="hdlist1">Produce</dt>
<dd>
<div class="ulist">
<ul>
<li>
<p>Bananas</p>
</li>
</ul>
</div>
</dd>
</dl>
</div>`;
  static readonly descriptionListComplexTiny = `<article adoc-name="document"><dl adoc-name="dlist"><dt>Dairy</dt><dd><ul adoc-name="ulist"><li adoc-name="list_item" attr-Text="Milk" attr-Marker="*">Milk</li><li adoc-name="list_item" attr-Text="Eggs" attr-Marker="*">Eggs</li></ul></dd><dt>Bakery</dt><dd><ul adoc-name="ulist"><li adoc-name="list_item" attr-Text="Bread" attr-Marker="*">Bread</li></ul></dd><dt>Produce</dt><dd><ul adoc-name="ulist"><li adoc-name="list_item" attr-Text="Bananas" attr-Marker="*">Bananas</li></ul></dd></dl></article>`;
  static readonly descriptionListComplexNormalized = this.descriptionListComplexAdoc;
  static readonly textFormatSimpleAdoc = `That is *strong* _emphasis_ \`monospace\` #highlight# ~sub~ ^sup^ **unconstrained strong** stuff!`;
  static readonly textFormatSimpleAdocCn = `译That is *译strong* _译emphasis_ \`monospace\` #译highlight# ~译sub~ ^译sup^ *译unconstrained strong*译 stuff!`;
  static readonly textFormatSimpleHtml = `<div class="paragraph">
<p>That is <strong>strong</strong> <em>emphasis</em> <code>monospace</code> <mark>highlight</mark> <sub>sub</sub> <sup>sup</sup> <strong>unconstrained strong</strong> stuff!</p>
</div>`;
  static readonly textFormatSimpleTiny = `<article adoc-name="document"><p adoc-name="paragraph">That is <strong adoc-name="inline_quoted" prop-type="strong" prop-alt="">strong</strong> <em adoc-name="inline_quoted" prop-type="emphasis" prop-alt="">emphasis</em> <code adoc-name="inline_quoted" prop-type="monospaced" prop-alt="">monospace</code> <mark adoc-name="inline_quoted" prop-type="mark" prop-alt="">highlight</mark> <sub adoc-name="inline_quoted" prop-type="subscript" prop-alt="">sub</sub> <sup adoc-name="inline_quoted" prop-type="superscript" prop-alt="">sup</sup> <strong adoc-name="inline_quoted" prop-type="strong" prop-alt="">unconstrained strong</strong> stuff!</p></article>`;
  static readonly textFormatSimpleNormalized = `That is *strong* _emphasis_ \`monospace\` #highlight# ~sub~ ^sup^ *unconstrained strong* stuff!`;
  static readonly textFormatNestedAdoc = `\`*_monospace bold italic phrase_*\` & \`\`*_char_*\`\`acter\`\`*_s_*\`\``;
  static readonly textFormatNestedAdocCn = `\`*_monospace bold italic phrase_*\` & \`*_char_*\`译acter\`\`*_s_*\`\``;
  static readonly textFormatNestedHtml = `<div class="paragraph">
<p><code><strong><em>monospace bold italic phrase</em></strong></code> &amp; <code><strong><em>char</em></strong></code>acter<code><strong><em>s</em></strong></code></p>
</div>`;
  static readonly textFormatNestedTiny = `<article adoc-name="document"><p adoc-name="paragraph"><code adoc-name="inline_quoted" prop-type="monospaced" prop-alt=""><strong adoc-name="inline_quoted" prop-type="strong" prop-alt=""><em adoc-name="inline_quoted" prop-type="emphasis" prop-alt="">monospace bold italic phrase</em></strong></code> &amp; <code adoc-name="inline_quoted" prop-type="monospaced" prop-alt=""><strong adoc-name="inline_quoted" prop-type="strong" prop-alt=""><em adoc-name="inline_quoted" prop-type="emphasis" prop-alt="">char</em></strong></code>acter<code adoc-name="inline_quoted" prop-type="monospaced" prop-alt=""><strong adoc-name="inline_quoted" prop-type="strong" prop-alt=""><em adoc-name="inline_quoted" prop-type="emphasis" prop-alt="">s</em></strong></code></p></article>`;
  static readonly textFormatNestedNormalized = this.textFormatNestedAdoc;
  static readonly textFormatLiteralMonospaceAdoc = `You can reference the value of a document attribute using
the syntax \`{name}\`, where  is the attribute name.`;
  static readonly textFormatLiteralMonospaceAdocCn = `译You can reference the value of a document attribute using
译the syntax \`{name}\`译, where  is the attribute name.`;
  static readonly textFormatLiteralMonospaceHtml = `<div class="paragraph">
<p>You can reference the value of a document attribute using
the syntax <code>{name}</code>, where  is the attribute name.</p>
</div>`;
  static readonly textFormatLiteralMonospaceTiny = `<article adoc-name="document"><p adoc-name="paragraph">You can reference the value of a document attribute using
the syntax <code adoc-name="inline_quoted" prop-type="monospaced" prop-alt="">{name}</code>, where  is the attribute name.</p></article>`;
  static readonly textFormatLiteralMonospaceNormalized = this.textFormatLiteralMonospaceAdoc;
  static readonly textFormatCustomSpanAdoc = `The text [.underline]#underline me# is underlined.`;
  static readonly textFormatCustomSpanAdocCn = `译The text [.underline]#译underline me#译 is underlined.`;
  static readonly textFormatCustomSpanHtml = `<div class="paragraph">
<p>The text <span class="underline">underline me</span> is underlined.</p>
</div>`;
  static readonly textFormatCustomSpanTiny = `<article adoc-name="document"><p adoc-name="paragraph">The text <span adoc-name="inline_quoted" data-role="underline" prop-type="unquoted" prop-alt="">underline me</span> is underlined.</p></article>`;
  static readonly textFormatCustomSpanNormalized = this.textFormatCustomSpanAdoc;
  static readonly autoLinksAdoc = `The homepage for the Asciidoctor Project is https://www.asciidoctor.org.
Email us at hello@example.com to say hello.`;
  static readonly autoLinksAdocCn = `译The homepage for the Asciidoctor Project is https://www.asciidoctor.org.
译Email us at hello@example.com译 to say hello.`;
  static readonly autoLinksHtml = `<div class="paragraph">
<p>The homepage for the Asciidoctor Project is <a href="https://www.asciidoctor.org" class="bare">https://www.asciidoctor.org</a>.
Email us at <a href="mailto:hello@example.com">hello@example.com</a> to say hello.</p>
</div>`;
  static readonly autoLinksTiny = `<article adoc-name="document"><p adoc-name="paragraph">The homepage for the Asciidoctor Project is <a adoc-name="inline_anchor" data-role="bare" prop-type="link" prop-alt="" prop-target="https://www.asciidoctor.org">https://www.asciidoctor.org</a>.
Email us at <a adoc-name="inline_anchor" prop-type="link" prop-alt="" prop-target="mailto:hello@example.com">hello@example.com</a> to say hello.</p></article>`;
  static readonly autoLinksNormalized = this.autoLinksAdoc;
  static readonly enclosedLinkAdoc = `You will often see https://example.org used in examples.`;
  static readonly enclosedLinkAdocCn = `译You will often see https://example.org译 used in examples.`;
  static readonly enclosedLinkHtml = `<div class="paragraph">
<p>You will often see <a href="https://example.org" class="bare">https://example.org</a> used in examples.</p>
</div>`;
  static readonly enclosedLinkTiny = `<article adoc-name="document"><p adoc-name="paragraph">You will often see <a adoc-name="inline_anchor" data-role="bare" prop-type="link" prop-alt="" prop-target="https://example.org">https://example.org</a> used in examples.</p></article>`;
  static readonly enclosedLinkNormalized = this.enclosedLinkAdoc;
  static readonly autoLinkEscapedAdoc = `Once launched, the site will be available at \\https://example.org.

If you cannot access the site, email \\help@example.org for assistance.`;
  static readonly autoLinkEscapedAdocCn = `译Once launched, the site will be available at \\https://example.org.

译If you cannot access the site, email \\help@example.org for assistance.`;
  static readonly autoLinkEscapedHtml = `<div class="paragraph">
<p>Once launched, the site will be available at \https://example.org.</p>
</div>
<div class="paragraph">
<p>If you cannot access the site, email \help@example.org for assistance.</p>
</div>`;
  static readonly autoLinkEscapedTiny = `<article adoc-name="document"><p adoc-name="paragraph">Once launched, the site will be available at https://example.org.</p><p adoc-name="paragraph">If you cannot access the site, email help@example.org for assistance.</p></article>`;
  static readonly autoLinkEscapedNormalized = this.autoLinkEscapedAdoc;
  static readonly urlMacroAdoc = `Chat with other Asciidoctor users on the https://discuss.asciidoctor.org/[*mailing list*^, role=green].`;
  static readonly urlMacroAdocCn = `译Chat with other Asciidoctor users on the https://discuss.asciidoctor.org/[*译mailing list*^, role=green].`;
  static readonly urlMacroHtml = `<div class="paragraph">
<p>Chat with other Asciidoctor users on the <a href="https://discuss.asciidoctor.org/" class="green" target="_blank" rel="noopener"><strong>mailing list</strong></a>.</p>
</div>`;
  static readonly urlMacroTiny = `<article adoc-name="document"><p adoc-name="paragraph">Chat with other Asciidoctor users on the <a adoc-name="inline_anchor" data-role="green" data-window="_blank" prop-type="link" prop-alt="" prop-target="https://discuss.asciidoctor.org/"><strong adoc-name="inline_quoted" prop-type="strong" prop-alt="">mailing list</strong></a>.</p></article>`;
  static readonly urlMacroNormalized = this.urlMacroAdoc;
  static readonly textInterpolationAdoc = `= Document Title
:link-with-underscores: https://asciidoctor.org/now_this__link_works.html

This URL has repeating underscores {link-with-underscores}.`;
  static readonly textInterpolationAdocCn = `= 译Document Title
:link-with-underscores: https://asciidoctor.org/now_this__link_works.html

译This URL has repeating underscores {link-with-underscores}.`;
  static readonly textInterpolationHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="generator" content="Asciidoctor 2.0.17">
<title>Document Title</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:300,300italic,400,400italic,600,600italic%7CNoto+Serif:400,400italic,700,700italic%7CDroid+Sans+Mono:400,700">
<link rel="stylesheet" href="./asciidoctor.css">
</head>
<body class="article">
<div id="header">
<h1>Document Title</h1>
</div>
<div id="content">
<div class="paragraph">
<p>This URL has repeating underscores <a href="https://asciidoctor.org/now_this__link_works.html" class="bare">https://asciidoctor.org/now_this__link_works.html</a>.</p>
</div>
</div>
<div id="footer">
<div id="footer-text">
Last updated 2000-01-01 00:00:00 +0000
</div>
</div>
</body>
</html>`;
  static readonly textInterpolationTiny = `<article adoc-name="document" data-doctitle="Document Title" data-link-with-underscores="https://asciidoctor.org/now_this__link_works.html"><p adoc-name="paragraph">This URL has repeating underscores <a adoc-name="inline_anchor" data-role="bare" prop-type="link" prop-alt="" prop-target="https://asciidoctor.org/now_this__link_works.html">https://asciidoctor.org/now_this__link_works.html</a>.</p></article>`;
  static readonly textInterpolationNormalized = this.textInterpolationAdoc;
  static readonly crossReferenceBasicAdoc = `The section <<anchors>> describes how automatic anchors work.`;
  static readonly crossReferenceBasicAdocCn = `译The section <<anchors,译anchors>>译 describes how automatic anchors work.`;
  static readonly crossReferenceBasicHtml = `<div class="paragraph">
<p>The section <a href="#anchors">[anchors]</a> describes how automatic anchors work.</p>
</div>`;
  static readonly crossReferenceBasicTiny = `<article adoc-name="document"><p adoc-name="paragraph">The section <a adoc-name="inline_anchor" data-fragment="anchors" data-refid="anchors" prop-type="xref" prop-alt="" prop-target="#anchors">anchors</a> describes how automatic anchors work.</p></article>`;
  static readonly crossReferenceBasicNormalized = this.crossReferenceBasicAdoc;
  static readonly crossReferenceWithTitleAdoc = `Learn how to <<link-macro-attributes,use attributes within the link macro>>.`;
  static readonly crossReferenceWithTitleAdocCn = `译Learn how to <<link-macro-attributes,译use attributes within the link macro>>.`;
  static readonly crossReferenceWithTitleHtml = `<div class="paragraph">
<p>Learn how to <a href="#link-macro-attributes">use attributes within the link macro</a>.</p>
</div>`;
  static readonly crossReferenceWithTitleTiny = `<article adoc-name="document"><p adoc-name="paragraph">Learn how to <a adoc-name="inline_anchor" data-fragment="link-macro-attributes" data-refid="link-macro-attributes" prop-type="xref" prop-alt="" prop-target="#link-macro-attributes">use attributes within the link macro</a>.</p></article>`;
  static readonly crossReferenceWithTitleNormalized = this.crossReferenceWithTitleAdoc;
  static readonly crossReferenceNatureAdoc = `Refer to <<Internal Cross References>>.`;
  static readonly crossReferenceNatureAdocCn = `译Refer to <<Internal Cross References,译Internal Cross References>>.`;
  static readonly crossReferenceNatureHtml = `<div class="paragraph">
<p>Refer to <a href="#Internal Cross References">[Internal Cross References]</a>.</p>
</div>`;
  static readonly crossReferenceNatureTiny = `<article adoc-name="document"><p adoc-name="paragraph">Refer to <a adoc-name="inline_anchor" data-fragment="Internal Cross References" data-refid="Internal Cross References" prop-type="xref" prop-alt="" prop-target="#Internal Cross References">Internal Cross References</a>.</p></article>`;
  static readonly crossReferenceNatureNormalized = this.crossReferenceNatureAdoc;
  static readonly crossReferenceToOtherDocumentAdoc = `Refer to <<document-b.adoc#section-b,Section B>> for more information.`;
  static readonly crossReferenceToOtherDocumentAdocCn = `译Refer to <<document-b.adoc#section-b,译Section B>>译 for more information.`;
  static readonly crossReferenceToOtherDocumentHtml = `<div class="paragraph">
<p>Refer to <a href="document-b.html#section-b">Section B</a> for more information.</p>
</div>`;
  static readonly crossReferenceToOtherDocumentTiny = `<article adoc-name="document"><p adoc-name="paragraph">Refer to <a adoc-name="inline_anchor" data-path="document-b.html" data-fragment="section-b" data-refid="document-b#section-b" prop-type="xref" prop-alt="" prop-target="document-b.html#section-b">Section B</a> for more information.</p></article>`;
  static readonly crossReferenceToOtherDocumentNormalized = this.crossReferenceToOtherDocumentAdoc;
  static readonly footnotesAdoc = `The hail-and-rainbow protocol can be initiated at five levels:

doublefootnote:[The double hail-and-rainbow level makes my toes tingle.]

A bold statement!footnote:disclaimer[Opinions are my own.]

Another outrageous statement.footnote:disclaimer[]`;
  static readonly footnotesAdocCn = `译The hail-and-rainbow protocol can be initiated at five levels:

译doublefootnote:[译The double hail-and-rainbow level makes my toes tingle.]

译A bold statement!footnote:disclaimer[译Opinions are my own.]

译Another outrageous statement.footnote:disclaimer[]`;
  static readonly footnotesHtml = `<div class="paragraph">
<p>The hail-and-rainbow protocol can be initiated at five levels:</p>
</div>
<div class="paragraph">
<p>double<sup class="footnote">[<a id="_footnoteref_1" class="footnote" href="#_footnotedef_1" title="View footnote.">1</a>]</sup></p>
</div>
<div class="paragraph">
<p>A bold statement!<sup class="footnote" id="_footnote_disclaimer">[<a id="_footnoteref_2" class="footnote" href="#_footnotedef_2" title="View footnote.">2</a>]</sup></p>
</div>
<div class="paragraph">
<p>Another outrageous statement.<sup class="footnoteref">[<a class="footnote" href="#_footnotedef_2" title="View footnote.">2</a>]</sup></p>
</div>
<div id="footnotes">
<hr>
<div class="footnote" id="_footnotedef_1">
<a href="#_footnoteref_1">1</a>. The double hail-and-rainbow level makes my toes tingle.
</div>
<div class="footnote" id="_footnotedef_2">
<a href="#_footnoteref_2">2</a>. Opinions are my own.
</div>
</div>`;
  static readonly footnotesTiny = `<article adoc-name="document"><p adoc-name="paragraph">The hail-and-rainbow protocol can be initiated at five levels:</p><p adoc-name="paragraph">double<span adoc-name="inline_footnote" data-index="1" type-data-index="number" prop-alt="">The double hail-and-rainbow level makes my toes tingle.</span></p><p adoc-name="paragraph">A bold statement!<span adoc-name="inline_footnote" attr-Id="disclaimer" data-index="2" type-data-index="number" prop-type="ref" prop-alt="">Opinions are my own.</span></p><p adoc-name="paragraph">Another outrageous statement.<span adoc-name="inline_footnote" data-index="2" type-data-index="number" prop-type="xref" prop-alt="" prop-target="disclaimer">Opinions are my own.</span></p></article>`;
  static readonly footnotesNormalized = this.footnotesAdoc;
  static readonly imageBlockAdoc = `image::sunset.jpg["Mesa Verde Sunset, by JAVH"]`;
  static readonly imageBlockAdocCn = `image::sunset.jpg["译Mesa Verde Sunset, by JAVH"]`;
  static readonly imageBlockHtml = `<div class="imageblock">
<div class="content">
<img src="sunset.jpg" alt="Mesa Verde Sunset, by JAVH">
</div>
</div>`;
  static readonly imageBlockTiny = `<article adoc-name="document"><img adoc-name="image" data-alt="Mesa Verde Sunset, by JAVH" data-target="sunset.jpg"/></article>`;
  static readonly imageBlockNormalized = this.imageBlockAdoc;
  static readonly imageInlineAdoc = `Click image:play.png[] to get the party started.

Click image:pause.png[Pause] when you need a break.`;
  static readonly imageInlineAdocCn = `译Click image:play.png[译play]译 to get the party started.

译Click image:pause.png[译Pause]译 when you need a break.`;
  static readonly imageInlineHtml = `<div class="paragraph">
<p>Click <span class="image"><img src="play.png" alt="play"></span> to get the party started.</p>
</div>
<div class="paragraph">
<p>Click <span class="image"><img src="pause.png" alt="Pause"></span> when you need a break.</p>
</div>`;
  static readonly imageInlineTiny = `<article adoc-name="document"><p adoc-name="paragraph">Click <img adoc-name="inline_image" data-default-alt="play" prop-type="image" prop-alt="play" prop-target="play.png" /> to get the party started.</p><p adoc-name="paragraph">Click <img adoc-name="inline_image" prop-type="image" prop-alt="Pause" prop-target="pause.png" /> when you need a break.</p></article>`;
  static readonly imageInlineNormalized = this.imageInlineAdoc;
  static readonly imageBlockWithTitleAndAttributesAdoc = `[#img-sunset,link=https://www.flickr.com/photos/javh/5448336655]
.A mountain sunset
image::sunset.jpg[Sunset,200,100]`;
  static readonly imageBlockWithTitleAndAttributesAdocCn = `[#img-sunset,link=https://www.flickr.com/photos/javh/5448336655]
.译A mountain sunset
image::sunset.jpg[译Sunset,200,100]`;
  static readonly imageBlockWithTitleAndAttributesHtml = `<div id="img-sunset" class="imageblock">
<div class="content">
<a class="image" href="https://www.flickr.com/photos/javh/5448336655"><img src="sunset.jpg" alt="Sunset" width="200" height="100"></a>
</div>
<div class="title">Figure 1. A mountain sunset</div>
</div>`;
  static readonly imageBlockWithTitleAndAttributesTiny = `<article adoc-name="document"><img adoc-name="image" attr-Title="A mountain sunset" attr-Caption="Figure 1. " attr-Numeral="1" type-attr-Numeral="number" attr-Id="img-sunset" data-attribute_entries="[{&quot;name&quot;:&quot;figure-number&quot;,&quot;value&quot;:1,&quot;negate&quot;:false}]" type-data-attribute_entries="object" data-link="https://www.flickr.com/photos/javh/5448336655" data-id="img-sunset" data-alt="Sunset" data-width="200" data-height="100" data-target="sunset.jpg"/></article>`;
  static readonly imageBlockWithTitleAndAttributesNormalized = this.imageBlockWithTitleAndAttributesAdoc;
  static readonly imageWithPositionalAttributesAdoc = `image::tiger.png[Tiger,200,200,float=right,align=center]`;
  static readonly imageWithPositionalAttributesAdocCn = `image::tiger.png[译Tiger,200,200,float=right,align=center]`;
  static readonly imageWithPositionalAttributesHtml = `<div class="imageblock right text-center">
<div class="content">
<img src="tiger.png" alt="Tiger" width="200" height="200">
</div>
</div>`;
  static readonly imageWithPositionalAttributesTiny = `<article adoc-name="document"><img adoc-name="image" data-alt="Tiger" data-width="200" data-height="200" data-float="right" data-align="center" data-target="tiger.png"/></article>`;
  static readonly imageWithPositionalAttributesNormalized = this.imageWithPositionalAttributesAdoc;
  static readonly videoAdoc = `video::tiger.mp4[Tiger,200,200,float=right,align=center]`;
  static readonly videoAdocCn = `video::tiger.mp4[译Tiger,200,200,float=right,align=center]`;
  static readonly videoHtml = `<div class="videoblock right text-center">
<div class="content">
<video src="tiger.mp4" width="200" height="200" poster="Tiger" controls>
Your browser does not support the video tag.
</video>
</div>
</div>`;
  static readonly videoTiny = `<article adoc-name="document"><video adoc-name="video" data-poster="Tiger" data-width="200" data-height="200" data-float="right" data-align="center" data-target="tiger.mp4">Your browser does not support the video tag.</video></article>`;
  static readonly videoNormalized = this.videoAdoc;
  static readonly iconAdoc = `icon:download[link=https://rubygems.org/downloads/whizbang-1.0.0.gem,window=_blank]`;
  static readonly iconAdocCn = `icon:download[link=https://rubygems.org/downloads/whizbang-1.0.0.gem,window=_blank]`;
  static readonly iconHtml = `<div class="paragraph">
<p><span class="icon"><a class="image" href="https://rubygems.org/downloads/whizbang-1.0.0.gem" target="_blank" rel="noopener">[download&#93;</a></span></p>
</div>`;
  static readonly iconTiny = `<article adoc-name="document"><p adoc-name="paragraph"><img adoc-name="inline_image" data-link="https://rubygems.org/downloads/whizbang-1.0.0.gem" data-window="_blank" data-default-alt="download" prop-type="icon" prop-alt="download" prop-target="download" /></p></article>`;
  static readonly iconNormalized = this.iconAdoc;
  static readonly keyboardMacroAdoc = `the hortkey is kbd:[Ctrl+F11]`;
  static readonly keyboardMacroAdocCn = `译the hortkey is kbd:[Ctrl+F11]`;
  static readonly keyboardMacroHtml = `<div class="paragraph">
<p>the hortkey is kbd:[Ctrl+F11]</p>
</div>`;
  static readonly keyboardMacroTiny = `<article adoc-name="document"><p adoc-name="paragraph">the hortkey is <span adoc-name="inline_kbd" data-keys="[&quot;Ctrl&quot;,&quot;F11&quot;]" type-data-keys="object" prop-alt=""><kbd>Ctrl</kbd>+<kbd>F11</kbd></span></p></article>`;
  static readonly keyboardMacroNormalized = this.keyboardMacroAdoc;
  static readonly buttonMacroAdoc = `Press the btn:[OK] button when you are finished.

Select a file in the file navigator and click btn:[Open].`;
  static readonly buttonMacroAdocCn = `译Press the btn:[OK]译 button when you are finished.

译Select a file in the file navigator and click btn:[译Open].`;
  static readonly buttonMacroHtml = `<div class="paragraph">
<p>Press the btn:[OK] button when you are finished.</p>
</div>
<div class="paragraph">
<p>Select a file in the file navigator and click btn:[Open].</p>
</div>`;
  static readonly buttonMacroTiny = `<article adoc-name="document"><p adoc-name="paragraph">Press the <button adoc-name="inline_button" prop-alt="">OK</button> button when you are finished.</p><p adoc-name="paragraph">Select a file in the file navigator and click <button adoc-name="inline_button" prop-alt="">Open</button>.</p></article>`;
  static readonly buttonMacroNormalized = this.buttonMacroAdoc;
  static readonly menuMacroAdoc = `To save the file, select menu:File[Save].

Select menu:View[Zoom > Reset > Now] to reset the zoom level to the default setting.`;
  static readonly menuMacroAdocCn = `译To save the file, select menu:译File[译Save].

译Select menu:译View[译Zoom > 译Reset > 译Now]译 to reset the zoom level to the default setting.`;
  static readonly menuMacroHtml = `<div class="paragraph">
<p>To save the file, select menu:File[Save].</p>
</div>
<div class="paragraph">
<p>Select menu:View[Zoom &gt; Reset &gt; Now] to reset the zoom level to the default setting.</p>
</div>`;
  static readonly menuMacroTiny = `<article adoc-name="document"><p adoc-name="paragraph">To save the file, select <span adoc-name="inline_menu" data-menu="File" data-menuitem="Save" prop-alt=""><span>File</span><span>Save</span></span>.</p><p adoc-name="paragraph">Select <span adoc-name="inline_menu" data-menu="View" data-submenus="[&quot;Zoom&quot;,&quot;Reset&quot;]" type-data-submenus="object" data-menuitem="Now" prop-alt=""><span>View</span><span>Zoom</span><span>Reset</span><span>Now</span></span> to reset the zoom level to the default setting.</p></article>`;
  static readonly menuMacroNormalized = this.menuMacroAdoc;
  static readonly admonitionSimpleAdoc = `abc

WARNING: Wolpertingers are known to nest in server racks.
Enter at your own risk.`;
  static readonly admonitionSimpleAdocCn = `译abc

WARNING: 译Wolpertingers are known to nest in server racks.
译Enter at your own risk.`;
  static readonly admonitionSimpleHtml = `<div class="paragraph">
<p>abc</p>
</div>
<div class="admonitionblock warning">
<table>
<tr>
<td class="icon">
<div class="title">Warning</div>
</td>
<td class="content">
Wolpertingers are known to nest in server racks.
Enter at your own risk.
</td>
</tr>
</table>
</div>`;
  static readonly admonitionSimpleTiny = `<article adoc-name="document"><p adoc-name="paragraph">abc</p><figure adoc-name="admonition" attr-Style="WARNING" attr-Caption="Warning" data-name="warning" data-textlabel="Warning">Wolpertingers are known to nest in server racks.
Enter at your own risk.</figure></article>`;
  static readonly admonitionSimpleNormalized = this.admonitionSimpleAdoc;
  static readonly admonitionComplexAdoc = `[IMPORTANT]
.Feeding the Werewolves
====
While werewolves are hardy community members, keep in mind the following dietary concerns:

. They are allergic to cinnamon.
. More than two glasses of orange juice in 24 hours makes them howl in harmony with alarms and sirens.
. Celery makes them sad.
====`;
  static readonly admonitionComplexAdocCn = `[IMPORTANT]
.译Feeding the Werewolves
====
译While werewolves are hardy community members, keep in mind the following dietary concerns:

. 译They are allergic to cinnamon.
. 译More than two glasses of orange juice in 24 hours makes them howl in harmony with alarms and sirens.
. 译Celery makes them sad.
====`;
  static readonly admonitionComplexHtml = `<div class="admonitionblock important">
<table>
<tr>
<td class="icon">
<div class="title">Important</div>
</td>
<td class="content">
<div class="title">Feeding the Werewolves</div>
<div class="paragraph">
<p>While werewolves are hardy community members, keep in mind the following dietary concerns:</p>
</div>
<div class="olist arabic">
<ol class="arabic">
<li>
<p>They are allergic to cinnamon.</p>
</li>
<li>
<p>More than two glasses of orange juice in 24 hours makes them howl in harmony with alarms and sirens.</p>
</li>
<li>
<p>Celery makes them sad.</p>
</li>
</ol>
</div>
</td>
</tr>
</table>
</div>`;
  static readonly admonitionComplexTiny = `<article adoc-name="document"><figure adoc-name="admonition" attr-Title="Feeding the Werewolves" attr-Style="IMPORTANT" attr-Caption="Important" data-title="Feeding the Werewolves" data-name="important" data-textlabel="Important"><p adoc-name="paragraph">While werewolves are hardy community members, keep in mind the following dietary concerns:</p><ol adoc-name="olist" attr-Style="arabic"><li adoc-name="list_item" attr-Text="They are allergic to cinnamon." attr-Marker=".">They are allergic to cinnamon.</li><li adoc-name="list_item" attr-Text="More than two glasses of orange juice in 24 hours makes them howl in harmony with alarms and sirens." attr-Marker=".">More than two glasses of orange juice in 24 hours makes them howl in harmony with alarms and sirens.</li><li adoc-name="list_item" attr-Text="Celery makes them sad." attr-Marker=".">Celery makes them sad.</li></ol></figure></article>`;
  static readonly admonitionComplexNormalized = this.admonitionComplexAdoc;
  static readonly sidebarSimpleAdoc = `[sidebar]
Sidebars are used to visually separate auxiliary bits of content
that supplement the main text.`;
  static readonly sidebarSimpleAdocCn = `[sidebar]
译Sidebars are used to visually separate auxiliary bits of content
译that supplement the main text.`;
  static readonly sidebarSimpleHtml = `<div class="sidebarblock">
<div class="content">
Sidebars are used to visually separate auxiliary bits of content
that supplement the main text.
</div>
</div>`;
  static readonly sidebarSimpleTiny = `<article adoc-name="document"><aside adoc-name="sidebar" attr-Style="sidebar">Sidebars are used to visually separate auxiliary bits of content
that supplement the main text.</aside></article>`;
  static readonly sidebarSimpleNormalized = this.sidebarSimpleAdoc;
  static readonly sidebarComplexAdoc = `.Optional Title
****
Sidebars are used to visually separate auxiliary bits of content
that supplement the main text.

TIP: They can contain any type of content.
****`;
  static readonly sidebarComplexAdocCn = `.译Optional Title
****
译Sidebars are used to visually separate auxiliary bits of content
译that supplement the main text.

TIP: 译They can contain any type of content.
****`;
  static readonly sidebarComplexHtml = `<div class="sidebarblock">
<div class="content">
<div class="title">Optional Title</div>
<div class="paragraph">
<p>Sidebars are used to visually separate auxiliary bits of content
that supplement the main text.</p>
</div>
<div class="admonitionblock tip">
<table>
<tr>
<td class="icon">
<div class="title">Tip</div>
</td>
<td class="content">
They can contain any type of content.
</td>
</tr>
</table>
</div>
</div>
</div>`;
  static readonly sidebarComplexTiny = `<article adoc-name="document"><aside adoc-name="sidebar" attr-Title="Optional Title" attr-Style="sidebar" data-title="Optional Title"><p adoc-name="paragraph">Sidebars are used to visually separate auxiliary bits of content
that supplement the main text.</p><figure adoc-name="admonition" attr-Style="TIP" attr-Caption="Tip" data-name="tip" data-textlabel="Tip">They can contain any type of content.</figure></aside></article>`;
  static readonly sidebarComplexNormalized = this.sidebarComplexAdoc;
  static readonly exampleBlockSimpleAdoc = `[example]
.Optional title
This is an example of an example block.`;
  static readonly exampleBlockSimpleAdocCn = `[example]
.译Optional title
译This is an example of an example block.`;
  static readonly exampleBlockSimpleHtml = `<div class="exampleblock">
<div class="title">Example 1. Optional title</div>
<div class="content">
This is an example of an example block.
</div>
</div>`;
  static readonly exampleBlockSimpleTiny = `<article adoc-name="document"><blockquote adoc-name="example" attr-Title="Optional title" attr-Style="example" attr-Caption="Example 1. " attr-Numeral="1" type-attr-Numeral="number" data-title="Optional title" data-attribute_entries="[{&quot;name&quot;:&quot;example-number&quot;,&quot;value&quot;:1,&quot;negate&quot;:false}]" type-data-attribute_entries="object">This is an example of an example block.</blockquote></article>`;
  static readonly exampleBlockSimpleNormalized = this.exampleBlockSimpleAdoc;
  static readonly exampleBlockComplexAdoc = `.Onomatopoeia
====
The book hit the floor with a *thud*.

He could hear doves *cooing* in the pine trees branches.
====`;
  static readonly exampleBlockComplexAdocCn = `.译Onomatopoeia
====
译The book hit the floor with a *译thud*.

译He could hear doves *译cooing*译 in the pine trees branches.
====`;
  static readonly exampleBlockComplexHtml = `<div class="exampleblock">
<div class="title">Example 1. Onomatopoeia</div>
<div class="content">
<div class="paragraph">
<p>The book hit the floor with a <strong>thud</strong>.</p>
</div>
<div class="paragraph">
<p>He could hear doves <strong>cooing</strong> in the pine trees branches.</p>
</div>
</div>
</div>`;
  static readonly exampleBlockComplexTiny = `<article adoc-name="document"><blockquote adoc-name="example" attr-Title="Onomatopoeia" attr-Style="example" attr-Caption="Example 1. " attr-Numeral="1" type-attr-Numeral="number" data-title="Onomatopoeia" data-attribute_entries="[{&quot;name&quot;:&quot;example-number&quot;,&quot;value&quot;:1,&quot;negate&quot;:false}]" type-data-attribute_entries="object"><p adoc-name="paragraph">The book hit the floor with a <strong adoc-name="inline_quoted" prop-type="strong" prop-alt="">thud</strong>.</p><p adoc-name="paragraph">He could hear doves <strong adoc-name="inline_quoted" prop-type="strong" prop-alt="">cooing</strong> in the pine trees branches.</p></blockquote></article>`;
  static readonly exampleBlockComplexNormalized = this.exampleBlockComplexAdoc;
  static readonly blockQuoteSimpleAdoc = `[quote,Captain James T. Kirk,Star Trek IV: The Voyage Home]
.After landing the cloaked Klingon bird of prey in Golden Gate park:
Everybody remember where we parked.`;
  static readonly blockQuoteSimpleAdocCn = `[quote,译Captain James T. Kirk,译Star Trek IV: The Voyage Home]
.译After landing the cloaked Klingon bird of prey in Golden Gate park:
译Everybody remember where we parked.`;
  static readonly blockQuoteSimpleHtml = `<div class="quoteblock">
<div class="title">After landing the cloaked Klingon bird of prey in Golden Gate park:</div>
<blockquote>
Everybody remember where we parked.
</blockquote>
<div class="attribution">
&#8212; Captain James T. Kirk<br>
<cite>Star Trek IV: The Voyage Home</cite>
</div>
</div>`;
  static readonly blockQuoteSimpleTiny = `<article adoc-name="document"><blockquote adoc-name="quote" attr-Title="After landing the cloaked Klingon bird of prey in Golden Gate park:" attr-Style="quote" data-title="After landing the cloaked Klingon bird of prey in Golden Gate park:" data-attribution="Captain James T. Kirk" data-citetitle="Star Trek IV: The Voyage Home">Everybody remember where we parked.</blockquote></article>`;
  static readonly blockQuoteSimpleNormalized = this.blockQuoteSimpleAdoc;
  static readonly blockQuoteHighlightAdoc = `[quote,Monty Python and the Holy Grail]
____
Dennis: Come and see the violence inherent in the system.

King Arthur: Bloody peasant!

Dennis: Oh, what a giveaway!
____`;
  static readonly blockQuoteHighlightAdocCn = `[quote,译Monty Python and the Holy Grail]
____
译Dennis: Come and see the violence inherent in the system.

译King Arthur: Bloody peasant!

译Dennis: Oh, what a giveaway!
____`;
  static readonly blockQuoteHighlightHtml = `<div class="quoteblock">
<blockquote>
<div class="paragraph">
<p>Dennis: Come and see the violence inherent in the system.</p>
</div>
<div class="paragraph">
<p>King Arthur: Bloody peasant!</p>
</div>
<div class="paragraph">
<p>Dennis: Oh, what a giveaway!</p>
</div>
</blockquote>
<div class="attribution">
&#8212; Monty Python and the Holy Grail
</div>
</div>`;
  static readonly blockQuoteHighlightTiny = `<article adoc-name="document"><blockquote adoc-name="quote" attr-Style="quote" data-attribution="Monty Python and the Holy Grail"><p adoc-name="paragraph">Dennis: Come and see the violence inherent in the system.</p><p adoc-name="paragraph">King Arthur: Bloody peasant!</p><p adoc-name="paragraph">Dennis: Oh, what a giveaway!</p></blockquote></article>`;
  static readonly blockQuoteHighlightNormalized = this.blockQuoteHighlightAdoc;
  static readonly blockQuoteShorthandAdoc = `"I hold it that a little rebellion now and then is a good thing,
and as necessary in the political world as storms in the physical."
-- Thomas Jefferson, Papers of Thomas Jefferson: Volume 11`;
  static readonly blockQuoteShorthandAdocCn = `"译I hold it that a little rebellion now and then is a good thing,
译and as necessary in the political world as storms in the physical."
-- 译Thomas Jefferson, 译Papers of Thomas Jefferson: Volume 11`;
  static readonly blockQuoteShorthandHtml = `<div class="quoteblock">
<blockquote>
I hold it that a little rebellion now and then is a good thing,
and as necessary in the political world as storms in the physical.
</blockquote>
<div class="attribution">
&#8212; Thomas Jefferson<br>
<cite>Papers of Thomas Jefferson: Volume 11</cite>
</div>
</div>`;
  static readonly blockQuoteShorthandTiny = `<article adoc-name="document"><blockquote adoc-name="quote" attr-Style="quote" data-attribution="Thomas Jefferson" data-citetitle="Papers of Thomas Jefferson: Volume 11">I hold it that a little rebellion now and then is a good thing,
and as necessary in the political world as storms in the physical.</blockquote></article>`;
  static readonly blockQuoteShorthandNormalized = this.blockQuoteShorthandAdoc;
  static readonly blockQuoteMarkdownAdoc = `> > What's new?
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
  static readonly blockQuoteMarkdownAdocCn = `____
____
译What's new?
____
译I've got Markdown in my AsciiDoc!

____
译Like what?
____
* 译Blockquotes
* 译Headings
* 译Fenced code blocks

____
译Is there more?
____
译Yep. AsciiDoc and Markdown share a lot of common syntax already.
____`;
  static readonly blockQuoteMarkdownHtml = `<div class="quoteblock">
<blockquote>
<div class="quoteblock">
<blockquote>
<div class="paragraph">
<p>What&#8217;s new?</p>
</div>
</blockquote>
</div>
<div class="paragraph">
<p>I&#8217;ve got Markdown in my AsciiDoc!</p>
</div>
<div class="quoteblock">
<blockquote>
<div class="paragraph">
<p>Like what?</p>
</div>
</blockquote>
</div>
<div class="ulist">
<ul>
<li>
<p>Blockquotes</p>
</li>
<li>
<p>Headings</p>
</li>
<li>
<p>Fenced code blocks</p>
</li>
</ul>
</div>
<div class="quoteblock">
<blockquote>
<div class="paragraph">
<p>Is there more?</p>
</div>
</blockquote>
</div>
<div class="paragraph">
<p>Yep. AsciiDoc and Markdown share a lot of common syntax already.</p>
</div>
</blockquote>
</div>`;
  static readonly blockQuoteMarkdownTiny = `<article adoc-name="document"><blockquote adoc-name="quote" attr-Style="quote"><blockquote adoc-name="quote" attr-Style="quote"><p adoc-name="paragraph">What's new?</p></blockquote><p adoc-name="paragraph">I've got Markdown in my AsciiDoc!</p><blockquote adoc-name="quote" attr-Style="quote"><p adoc-name="paragraph">Like what?</p></blockquote><ul adoc-name="ulist"><li adoc-name="list_item" attr-Text="Blockquotes" attr-Marker="*">Blockquotes</li><li adoc-name="list_item" attr-Text="Headings" attr-Marker="*">Headings</li><li adoc-name="list_item" attr-Text="Fenced code blocks" attr-Marker="*">Fenced code blocks</li></ul><blockquote adoc-name="quote" attr-Style="quote"><p adoc-name="paragraph">Is there more?</p></blockquote><p adoc-name="paragraph">Yep. AsciiDoc and Markdown share a lot of common syntax already.</p></blockquote></article>`;
  static readonly blockQuoteMarkdownNormalized = `____
____
What's new?
____
I've got Markdown in my AsciiDoc!

____
Like what?
____
* Blockquotes
* Headings
* Fenced code blocks

____
Is there more?
____
Yep. AsciiDoc and Markdown share a lot of common syntax already.
____`;
  static readonly verseAdoc = `[verse,Carl Sandburg,two lines from the poem Fog]
The fog comes
on little cat feet.`;
  static readonly verseAdocCn = `[verse,译Carl Sandburg,译two lines from the poem Fog]
译The fog comes
译on little cat feet.`;
  static readonly verseHtml = `<div class="verseblock">
<pre class="content">The fog comes
on little cat feet.</pre>
<div class="attribution">
&#8212; Carl Sandburg<br>
<cite>two lines from the poem Fog</cite>
</div>
</div>`;
  static readonly verseTiny = `<article adoc-name="document"><figure adoc-name="verse" attr-Style="verse" data-attribution="Carl Sandburg" data-citetitle="two lines from the poem Fog">The fog comes
on little cat feet.</figure></article>`;
  static readonly verseNormalized = this.verseAdoc;
  static readonly sourceCodeSimpleAdoc = `[source,ruby]
----
require 'sinatra'

get '/hi' do
"Hello World!"
end
----`;
  static readonly sourceCodeSimpleAdocCn = Examples.sourceCodeSimpleAdoc;
  static readonly sourceCodeSimpleHtml = `<div class="listingblock">
<div class="content">
<pre class="highlight"><code class="language-ruby" data-lang="ruby">require 'sinatra'

get '/hi' do
"Hello World!"
end</code></pre>
</div>
</div>`;
  static readonly sourceCodeSimpleTiny = `<article adoc-name="document"><code adoc-name="listing" attr-Style="source" data-language="ruby">require 'sinatra'

get '/hi' do
"Hello World!"
end</code></article>`;
  static readonly sourceCodeSimpleNormalized = this.sourceCodeSimpleAdoc;
  static readonly sourceCodeNoIndentAdoc = `[source,ruby,indent=0]
----
require 'sinatra'

get '/hi' do
"Hello World!"
end
----`;
  static readonly sourceCodeNoIndentAdocCn = Examples.sourceCodeNoIndentAdoc;
  static readonly sourceCodeNoIndentHtml = `<div class="listingblock">
<div class="content">
<pre class="highlight"><code class="language-ruby" data-lang="ruby">require 'sinatra'

get '/hi' do
"Hello World!"
end</code></pre>
</div>
</div>`;
  static readonly sourceCodeNoIndentTiny = `<article adoc-name="document"><code adoc-name="listing" attr-Style="source" data-rawIndent="0" data-language="ruby">require 'sinatra'

get '/hi' do
"Hello World!"
end</code></article>`;
  static readonly sourceCodeNoIndentNormalized = this.sourceCodeNoIndentAdoc;
  static readonly sourceCodeHighlightAdoc = `[source#hello,ruby]
----
require 'sinatra'

get '/hi' do
"Hello World!"
end
----`;
  static readonly sourceCodeHighlightAdocCn = Examples.sourceCodeHighlightAdoc;
  static readonly sourceCodeHighlightHtml = `<div id="hello" class="listingblock">
<div class="content">
<pre class="highlight"><code class="language-ruby" data-lang="ruby">require 'sinatra'

get '/hi' do
"Hello World!"
end</code></pre>
</div>
</div>`;
  static readonly sourceCodeHighlightTiny = `<article adoc-name="document"><code adoc-name="listing" attr-Style="source" attr-Id="hello" data-id="hello" data-language="ruby">require 'sinatra'

get '/hi' do
"Hello World!"
end</code></article>`;
  static readonly sourceCodeHighlightNormalized = this.sourceCodeHighlightAdoc;
  static readonly sourceCodeHighlightLinesAdoc = `[source%linenums,ruby,highlight=2..5]
----
ORDERED_LIST_KEYWORDS = {
'loweralpha' => 'a',
'lowerroman' => 'i',
'upperalpha' => 'A',
'upperroman' => 'I',
}
----`;
  static readonly sourceCodeHighlightLinesAdocCn = Examples.sourceCodeHighlightLinesAdoc;
  static readonly sourceCodeHighlightLinesHtml = `<div class="listingblock">
<div class="content">
<pre class="highlight"><code class="language-ruby" data-lang="ruby">ORDERED_LIST_KEYWORDS = {
'loweralpha' =&gt; 'a',
'lowerroman' =&gt; 'i',
'upperalpha' =&gt; 'A',
'upperroman' =&gt; 'I',
}</code></pre>
</div>
</div>`;
  static readonly sourceCodeHighlightLinesTiny = `<article adoc-name="document"><code adoc-name="listing" attr-Style="source" data-highlight="2..5" data-linenums-option="" data-language="ruby" data-linenums="">ORDERED_LIST_KEYWORDS = {
'loweralpha' =&gt; 'a',
'lowerroman' =&gt; 'i',
'upperalpha' =&gt; 'A',
'upperroman' =&gt; 'I',
}</code></article>`;
  static readonly sourceCodeHighlightLinesNormalized = this.sourceCodeHighlightLinesAdoc;
  static readonly listingBlockAdoc = `[subs=+attributes]
----
This is a _delimited listing block_
with the \`subs\` attribute assigned
the incremental value \`+attributes\`.
This attribute reference:

{replace-me}

will be replaced with the attribute's
value when rendered.
----`;
  static readonly listingBlockAdocCn = `[subs=+attributes]
----
译This is a _译delimited listing block_
译with the \`subs\`译 attribute assigned
译the incremental value \`+attributes\`.
译This attribute reference:

译{replace-me}

译will be replaced with the attribute's
译value when rendered.
----`;
  static readonly listingBlockHtml = `<div class="listingblock">
<div class="content">
<pre>This is a _delimited listing block_
with the \`subs\` attribute assigned
the incremental value \`+attributes\`.
This attribute reference:

{replace-me}

will be replaced with the attribute's
value when rendered.</pre>
</div>
</div>`;
  static readonly listingBlockTiny = `<article adoc-name="document"><pre adoc-name="listing" attr-Style="listing" data-subs="+attributes">This is a _delimited listing block_
with the \`subs\` attribute assigned
the incremental value \`+attributes\`.
This attribute reference:

{replace-me}

will be replaced with the attribute's
value when rendered.</pre></article>`;
  static readonly listingBlockNormalized = this.listingBlockAdoc;
  static readonly literalBlockWithStyleAdoc = `[literal]
....
error: 1954 Forbidden search
absolutely fatal: operation lost in the dodecahedron of doom
Would you like to try again? y/n
....`;
  static readonly literalBlockWithStyleAdocCn = Examples.literalBlockWithStyleAdoc;
  static readonly literalBlockWithStyleHtml = `<div class="literalblock">
<div class="content">
<pre>error: 1954 Forbidden search
absolutely fatal: operation lost in the dodecahedron of doom
Would you like to try again? y/n</pre>
</div>
</div>`;
  static readonly literalBlockWithStyleTiny = `<article adoc-name="document"><pre adoc-name="literal" attr-Style="literal">error: 1954 Forbidden search
absolutely fatal: operation lost in the dodecahedron of doom
Would you like to try again? y/n</pre></article>`;
  static readonly literalBlockWithStyleNormalized = this.literalBlockWithStyleAdoc;
  static readonly literalBlockWithDelimiterAdoc = `....
Kismet: Where is the *defensive operations manual*?

Computer: Calculating ...
Can not locate object.
You are not authorized to know it exists.

Kismet: Did the werewolves tell you to say that?

Computer: Calculating ...
....`;
  static readonly literalBlockWithDelimiterAdocCn = Examples.literalBlockWithDelimiterAdoc;
  static readonly literalBlockWithDelimiterHtml = `<div class="literalblock">
<div class="content">
<pre>Kismet: Where is the *defensive operations manual*?

Computer: Calculating ...
Can not locate object.
You are not authorized to know it exists.

Kismet: Did the werewolves tell you to say that?

Computer: Calculating ...</pre>
</div>
</div>`;
  static readonly literalBlockWithDelimiterTiny = `<article adoc-name="document"><pre adoc-name="literal" attr-Style="literal">Kismet: Where is the *defensive operations manual*?

Computer: Calculating ...
Can not locate object.
You are not authorized to know it exists.

Kismet: Did the werewolves tell you to say that?

Computer: Calculating ...</pre></article>`;
  static readonly literalBlockWithDelimiterNormalized = this.literalBlockWithDelimiterAdoc;
  static readonly sourceCodeCalloutsAdoc = `[source,ruby]
----
require 'sinatra' <1>

get '/hi' do <2> <3>
"Hello World!"
end
----

<1> Library import
<2> URL mapping
<3> Response block`;
  static readonly sourceCodeCalloutsAdocCn = `[source,ruby]
----
require 'sinatra' <1>

get '/hi' do <2> <3>
"Hello World!"
end
----

<1> 译Library import
<2> 译URL mapping
<3> 译Response block`;
  static readonly sourceCodeCalloutsHtml = `<div class="listingblock">
<div class="content">
<pre class="highlight"><code class="language-ruby" data-lang="ruby">require 'sinatra' <b class="conum">(1)</b>

get '/hi' do <b class="conum">(2)</b> <b class="conum">(3)</b>
"Hello World!"
end</code></pre>
</div>
</div>
<div class="colist arabic">
<ol>
<li>
<p>Library import</p>
</li>
<li>
<p>URL mapping</p>
</li>
<li>
<p>Response block</p>
</li>
</ol>
</div>`;
  static readonly sourceCodeCalloutsTiny = `<article adoc-name="document"><code adoc-name="listing" attr-Style="source" data-language="ruby">require 'sinatra' <li adoc-name="inline_callout" attr-Id="CO1-1" prop-alt="">1</li>

get '/hi' do <li adoc-name="inline_callout" attr-Id="CO1-2" prop-alt="">2</li> <li adoc-name="inline_callout" attr-Id="CO1-3" prop-alt="">3</li>
"Hello World!"
end</code><ol adoc-name="colist" attr-Style="arabic"><li adoc-name="list_item" attr-Text="Library import" attr-Marker="<1>" data-coids="CO1-1">Library import</li><li adoc-name="list_item" attr-Text="URL mapping" attr-Marker="<1>" data-coids="CO1-2">URL mapping</li><li adoc-name="list_item" attr-Text="Response block" attr-Marker="<1>" data-coids="CO1-3">Response block</li></ol></article>`;
  static readonly sourceCodeCalloutsNormalized = this.sourceCodeCalloutsAdoc;
  static readonly sourceCodeWithIndentAdoc = `[source,ruby,indent=2]
----
def names
@name.split ' '
end
----`;
  static readonly sourceCodeWithIndentAdocCn = Examples.sourceCodeWithIndentAdoc;
  static readonly sourceCodeWithIndentHtml = `<div class="listingblock">
<div class="content">
<pre class="highlight"><code class="language-ruby" data-lang="ruby">  def names
  @name.split ' '
  end</code></pre>
</div>
</div>`;
  static readonly sourceCodeWithIndentTiny = `<article adoc-name="document"><code adoc-name="listing" attr-Style="source" data-rawIndent="2" data-language="ruby">def names
@name.split ' '
end</code></article>`;
  static readonly sourceCodeWithIndentNormalized = this.sourceCodeWithIndentAdoc;
  static readonly tableEmptyAdoc = `[cols="1,1"]
|===`;
  static readonly tableEmptyAdocCn = `[cols="1,1"]
|===`;
  static readonly tableEmptyHtml = `<table class="tableblock frame-all grid-all stretch">
</table>`;
  static readonly tableEmptyTiny = `<article adoc-name="document"><table adoc-name="table" attr-ColumnCount="2" type-attr-ColumnCount="number" attr-Style="table" data-tablepcwidth="100" type-data-tablepcwidth="number" data-colcount="2" type-data-colcount="number" data-cols="1,1"><colgroup><col data-width="1" data-colnumber="1" data-halign="left" data-valign="top" data-colpcwidth="50"/><col data-width="1" data-colnumber="2" data-halign="left" data-valign="top" data-colpcwidth="50"/></colgroup></table></article>`;
  static readonly tableEmptyNormalized = this.tableEmptyAdoc;
  static readonly tableWithTitleAdoc = `[cols="1,1"]
.Table Title
|===`;
  static readonly tableWithTitleAdocCn = `[cols="1,1"]
.译Table Title
|===`;
  static readonly tableWithTitleHtml = `<table class="tableblock frame-all grid-all stretch">
<caption class="title">Table 1. Table Title</caption>
</table>`;
  static readonly tableWithTitleTiny = `<article adoc-name="document"><table adoc-name="table" attr-ColumnCount="2" type-attr-ColumnCount="number" attr-Title="Table Title" attr-Style="table" attr-Caption="Table 1. " attr-Numeral="1" type-attr-Numeral="number" data-tablepcwidth="100" type-data-tablepcwidth="number" data-colcount="2" type-data-colcount="number" data-attribute_entries="[{&quot;name&quot;:&quot;table-number&quot;,&quot;value&quot;:1,&quot;negate&quot;:false}]" type-data-attribute_entries="object" data-cols="1,1"><caption>Table 1. </caption><colgroup><col data-width="1" data-colnumber="1" data-halign="left" data-valign="top" data-colpcwidth="50"/><col data-width="1" data-colnumber="2" data-halign="left" data-valign="top" data-colpcwidth="50"/></colgroup></table></article>`;
  static readonly tableWithTitleNormalized = this.tableWithTitleAdoc;
  static readonly tableWithoutHeaderAdoc = `[cols="1,1"]
|===
|Cell in column 1, row 1
|Cell in column 2, row 1

|Cell in column 1, row 2
|Cell in column 2, row 2

|Cell in column 1, row 3
|Cell in column 2, row 3
|===`;
  static readonly tableWithoutHeaderAdocCn = `[cols="1,1"]
|===
|译Cell in column 1, row 1
|译Cell in column 2, row 1

|译Cell in column 1, row 2
|译Cell in column 2, row 2

|译Cell in column 1, row 3
|译Cell in column 2, row 3
|===`;
  static readonly tableWithoutHeaderHtml = `<table class="tableblock frame-all grid-all stretch">
<colgroup>
<col style="width: 50%;">
<col style="width: 50%;">
</colgroup>
<tbody>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 1, row 1</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 2, row 1</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 1, row 2</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 2, row 2</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 1, row 3</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 2, row 3</p></td>
</tr>
</tbody>
</table>`;
  static readonly tableWithoutHeaderTiny = `<article adoc-name="document"><table adoc-name="table" attr-RowCount="3" type-attr-RowCount="number" attr-ColumnCount="2" type-attr-ColumnCount="number" attr-Style="table" data-tablepcwidth="100" type-data-tablepcwidth="number" data-colcount="2" type-data-colcount="number" data-rowcount="3" type-data-rowcount="number" data-cols="1,1"><colgroup><col data-width="1" data-colnumber="1" data-halign="left" data-valign="top" data-colpcwidth="50"/><col data-width="1" data-colnumber="2" data-halign="left" data-valign="top" data-colpcwidth="50"/></colgroup><tbody><tr><td data-width="1" data-colnumber="1" data-halign="left" data-valign="top" data-colpcwidth="50">Cell in column 1, row 1</td><td data-width="1" data-colnumber="2" data-halign="left" data-valign="top" data-colpcwidth="50">Cell in column 2, row 1</td></tr><tr><td data-width="1" data-colnumber="1" data-halign="left" data-valign="top" data-colpcwidth="50">Cell in column 1, row 2</td><td data-width="1" data-colnumber="2" data-halign="left" data-valign="top" data-colpcwidth="50">Cell in column 2, row 2</td></tr><tr><td data-width="1" data-colnumber="1" data-halign="left" data-valign="top" data-colpcwidth="50">Cell in column 1, row 3</td><td data-width="1" data-colnumber="2" data-halign="left" data-valign="top" data-colpcwidth="50">Cell in column 2, row 3</td></tr></tbody></table></article>`;
  static readonly tableWithoutHeaderNormalized = this.tableWithoutHeaderAdoc;
  static readonly tableWithHeaderAdoc = `[%footer,cols="1,1"]
|===
|Cell in column 1, header row |Cell in column 2, header row

|Cell in column 1, row 2
|Cell in column 2, row 2

|Cell in column 1, row 3
|Cell in column 2, row 3

|Cell in column 1, row 4
|Cell in column 2, row 4

|Cell in column 1, footer row
|Cell in column 2, footer row
|===`;
  static readonly tableWithHeaderAdocCn = `[%footer,cols="1,1"]
|===
|译Cell in column 1, header row |译Cell in column 2, header row

|译Cell in column 1, row 2
|译Cell in column 2, row 2

|译Cell in column 1, row 3
|译Cell in column 2, row 3

|译Cell in column 1, row 4
|译Cell in column 2, row 4

|译Cell in column 1, footer row
|译Cell in column 2, footer row
|===`;
  static readonly tableWithHeaderHtml = `<table class="tableblock frame-all grid-all stretch">
<colgroup>
<col style="width: 50%;">
<col style="width: 50%;">
</colgroup>
<thead>
<tr>
<th class="tableblock halign-left valign-top">Cell in column 1, header row</th>
<th class="tableblock halign-left valign-top">Cell in column 2, header row</th>
</tr>
</thead>
<tbody>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 1, row 2</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 2, row 2</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 1, row 3</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 2, row 3</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 1, row 4</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 2, row 4</p></td>
</tr>
</tbody>
<tfoot>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 1, footer row</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 2, footer row</p></td>
</tr>
</tfoot>
</table>`;
  static readonly tableWithHeaderTiny = `<article adoc-name="document"><table adoc-name="table" attr-RowCount="5" type-attr-RowCount="number" attr-ColumnCount="2" type-attr-ColumnCount="number" attr-Style="table" data-tablepcwidth="100" type-data-tablepcwidth="number" data-colcount="2" type-data-colcount="number" data-rowcount="5" type-data-rowcount="number" data-cols="1,1" data-footer-option=""><colgroup><col data-width="1" data-colnumber="1" data-halign="left" data-valign="top" data-colpcwidth="50"/><col data-width="1" data-colnumber="2" data-halign="left" data-valign="top" data-colpcwidth="50"/></colgroup><thead><tr><th data-width="1" data-colnumber="1" data-halign="left" data-valign="top" data-colpcwidth="50">Cell in column 1, header row</th><th data-width="1" data-colnumber="2" data-halign="left" data-valign="top" data-colpcwidth="50">Cell in column 2, header row</th></tr></thead><tbody><tr><td data-width="1" data-colnumber="1" data-halign="left" data-valign="top" data-colpcwidth="50">Cell in column 1, row 2</td><td data-width="1" data-colnumber="2" data-halign="left" data-valign="top" data-colpcwidth="50">Cell in column 2, row 2</td></tr><tr><td data-width="1" data-colnumber="1" data-halign="left" data-valign="top" data-colpcwidth="50">Cell in column 1, row 3</td><td data-width="1" data-colnumber="2" data-halign="left" data-valign="top" data-colpcwidth="50">Cell in column 2, row 3</td></tr><tr><td data-width="1" data-colnumber="1" data-halign="left" data-valign="top" data-colpcwidth="50">Cell in column 1, row 4</td><td data-width="1" data-colnumber="2" data-halign="left" data-valign="top" data-colpcwidth="50">Cell in column 2, row 4</td></tr></tbody><tfoot><tr><td data-width="1" data-colnumber="1" data-halign="left" data-valign="top" data-colpcwidth="50">Cell in column 1, footer row</td><td data-width="1" data-colnumber="2" data-halign="left" data-valign="top" data-colpcwidth="50">Cell in column 2, footer row</td></tr></tfoot></table></article>`;
  static readonly tableWithHeaderNormalized = this.tableWithHeaderAdoc;
  static readonly tableAlignmentAdoc = `|===
|Column Name |Column Name |Column Name

|Left-aligned content.
^|Center-aligned content.
>|Right-aligned content.

|Top-aligned content.
.^|Middle-aligned content.
.>|Bottom-aligned content.

.^|Top-right-aligned content.
^.^|Middle-center-aligned content.
>.>|Bottom-right-aligned content.
|===`;
  static readonly tableAlignmentAdocCn = `|===
|译Column Name |译Column Name |译Column Name

|译Left-aligned content.
^|译Center-aligned content.
>|译Right-aligned content.

|译Top-aligned content.
.^|译Middle-aligned content.
.>|译Bottom-aligned content.

.^|译Top-right-aligned content.
^.^|译Middle-center-aligned content.
>.>|译Bottom-right-aligned content.
|===`;
  static readonly tableAlignmentHtml = `<table class="tableblock frame-all grid-all stretch">
<colgroup>
<col style="width: 33.3333%;">
<col style="width: 33.3333%;">
<col style="width: 33.3334%;">
</colgroup>
<thead>
<tr>
<th class="tableblock halign-left valign-top">Column Name</th>
<th class="tableblock halign-left valign-top">Column Name</th>
<th class="tableblock halign-left valign-top">Column Name</th>
</tr>
</thead>
<tbody>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock">Left-aligned content.</p></td>
<td class="tableblock halign-center valign-top"><p class="tableblock">Center-aligned content.</p></td>
<td class="tableblock halign-right valign-top"><p class="tableblock">Right-aligned content.</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock">Top-aligned content.</p></td>
<td class="tableblock halign-left valign-middle"><p class="tableblock">Middle-aligned content.</p></td>
<td class="tableblock halign-left valign-bottom"><p class="tableblock">Bottom-aligned content.</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-middle"><p class="tableblock">Top-right-aligned content.</p></td>
<td class="tableblock halign-center valign-middle"><p class="tableblock">Middle-center-aligned content.</p></td>
<td class="tableblock halign-right valign-bottom"><p class="tableblock">Bottom-right-aligned content.</p></td>
</tr>
</tbody>
</table>`;
  static readonly tableAlignmentTiny = `<article adoc-name="document"><table adoc-name="table" attr-RowCount="4" type-attr-RowCount="number" attr-ColumnCount="3" type-attr-ColumnCount="number" attr-Style="table" data-tablepcwidth="100" type-data-tablepcwidth="number" data-colcount="3" type-data-colcount="number" data-rowcount="4" type-data-rowcount="number"><colgroup><col data-colnumber="1" data-width="1" data-halign="left" data-valign="top" data-colpcwidth="33.3333"/><col data-colnumber="2" data-width="1" data-halign="left" data-valign="top" data-colpcwidth="33.3333"/><col data-colnumber="3" data-width="1" data-halign="left" data-valign="top" data-colpcwidth="33.3334"/></colgroup><thead><tr><th data-colnumber="1" data-width="1" data-halign="left" data-valign="top">Column Name</th><th data-colnumber="2" data-width="1" data-halign="left" data-valign="top">Column Name</th><th data-colnumber="3" data-width="1" data-halign="left" data-valign="top">Column Name</th></tr></thead><tbody><tr><td data-colnumber="1" data-width="1" data-halign="left" data-valign="top">Left-aligned content.</td><td data-colnumber="2" data-width="1" data-halign="center" data-valign="top">Center-aligned content.</td><td data-colnumber="3" data-width="1" data-halign="right" data-valign="top">Right-aligned content.</td></tr><tr><td data-colnumber="1" data-width="1" data-halign="left" data-valign="top">Top-aligned content.</td><td data-colnumber="2" data-width="1" data-halign="left" data-valign="middle">Middle-aligned content.</td><td data-colnumber="3" data-width="1" data-halign="left" data-valign="bottom">Bottom-aligned content.</td></tr><tr><td data-colnumber="1" data-width="1" data-halign="left" data-valign="middle">Top-right-aligned content.</td><td data-colnumber="2" data-width="1" data-halign="center" data-valign="middle">Middle-center-aligned content.</td><td data-colnumber="3" data-width="1" data-halign="right" data-valign="bottom">Bottom-right-aligned content.</td></tr></tbody></table></article>`;
  static readonly tableAlignmentNormalized = this.tableAlignmentAdoc;
  static readonly tableFormatCellContentAdoc = `|===
|Column 1 |Column 2

a|asciidoc,
e|emphasis,

h|header,
l|literal,

m|monospaced,
s|strong,
|===`;
  static readonly tableFormatCellContentAdocCn = `|===
|译Column 1 |译Column 2

a|译asciidoc,
e|译emphasis,

h|译header,
l|译literal,

m|译monospaced,
s|译strong,
|===`;
  static readonly tableFormatCellContentHtml = `<table class="tableblock frame-all grid-all stretch">
<colgroup>
<col style="width: 50%;">
<col style="width: 50%;">
</colgroup>
<thead>
<tr>
<th class="tableblock halign-left valign-top">Column 1</th>
<th class="tableblock halign-left valign-top">Column 2</th>
</tr>
</thead>
<tbody>
<tr>
<td class="tableblock halign-left valign-top"><div class="content"><div class="paragraph">
<p>asciidoc,</p>
</div></div></td>
<td class="tableblock halign-left valign-top"><p class="tableblock"><em>emphasis,</em></p></td>
</tr>
<tr>
<th class="tableblock halign-left valign-top"><p class="tableblock">header,</p></th>
<td class="tableblock halign-left valign-top"><div class="literal"><pre>literal,</pre></div></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock"><code>monospaced,</code></p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock"><strong>strong,</strong></p></td>
</tr>
</tbody>
</table>`;
  static readonly tableFormatCellContentTiny = `<article adoc-name="document"><table adoc-name="table" attr-RowCount="4" type-attr-RowCount="number" attr-ColumnCount="2" type-attr-ColumnCount="number" attr-Style="table" data-tablepcwidth="100" type-data-tablepcwidth="number" data-colcount="2" type-data-colcount="number" data-rowcount="4" type-data-rowcount="number"><colgroup><col data-colnumber="1" data-width="1" data-halign="left" data-valign="top" data-colpcwidth="50"/><col data-colnumber="2" data-width="1" data-halign="left" data-valign="top" data-colpcwidth="50"/></colgroup><thead><tr><th data-colnumber="1" data-width="1" data-halign="left" data-valign="top">Column 1</th><th data-colnumber="2" data-width="1" data-halign="left" data-valign="top">Column 2</th></tr></thead><tbody><tr><td data-colnumber="1" data-width="1" data-halign="left" data-valign="top" data-style="asciidoc"><article adoc-name="document"><p adoc-name="paragraph">asciidoc,</p></article></td><td data-colnumber="2" data-width="1" data-halign="left" data-valign="top" data-style="emphasis"><em adoc-name="inline_quoted" prop-type="emphasis" prop-alt="">emphasis,</em></td></tr><tr><td data-colnumber="1" data-width="1" data-halign="left" data-valign="top" data-style="header">header,</td><td data-colnumber="2" data-width="1" data-halign="left" data-valign="top" data-style="literal"><span adoc-name="inline_quoted" prop-type="literal" prop-alt="">literal,</span></td></tr><tr><td data-colnumber="1" data-width="1" data-halign="left" data-valign="top" data-style="monospaced"><code adoc-name="inline_quoted" prop-type="monospaced" prop-alt="">monospaced,</code></td><td data-colnumber="2" data-width="1" data-halign="left" data-valign="top" data-style="strong"><strong adoc-name="inline_quoted" prop-type="strong" prop-alt="">strong,</strong></td></tr></tbody></table></article>`;
  static readonly tableFormatCellContentNormalized = this.tableFormatCellContentAdoc;
  static readonly tableOverrideStyleAdoc = `[cols=">a,e"]
|===
|Column 1, header row |Column 2, header row

|monospaced
|monospaced

s|strong
|*strong*

|default
|monospaced
|===`;
  static readonly tableOverrideStyleAdocCn = `[cols=">a,e"]
|===
|译Column 1, header row |译Column 2, header row

|译monospaced
|译monospaced

s|译strong
|译*strong*

|译default
|译monospaced
|===`;
  static readonly tableOverrideStyleHtml = `<table class="tableblock frame-all grid-all stretch">
<colgroup>
<col style="width: 50%;">
<col style="width: 50%;">
</colgroup>
<thead>
<tr>
<th class="tableblock halign-right valign-top">Column 1, header row</th>
<th class="tableblock halign-left valign-top">Column 2, header row</th>
</tr>
</thead>
<tbody>
<tr>
<td class="tableblock halign-right valign-top"><div class="content"><div class="paragraph">
<p>monospaced</p>
</div></div></td>
<td class="tableblock halign-left valign-top"><p class="tableblock"><em>monospaced</em></p></td>
</tr>
<tr>
<td class="tableblock halign-right valign-top"><p class="tableblock"><strong>strong</strong></p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock"><em><strong>strong</strong></em></p></td>
</tr>
<tr>
<td class="tableblock halign-right valign-top"><div class="content"><div class="paragraph">
<p>default</p>
</div></div></td>
<td class="tableblock halign-left valign-top"><p class="tableblock"><em>monospaced</em></p></td>
</tr>
</tbody>
</table>`;
  static readonly tableOverrideStyleTiny = `<article adoc-name="document"><table adoc-name="table" attr-RowCount="4" type-attr-RowCount="number" attr-ColumnCount="2" type-attr-ColumnCount="number" attr-Style="table" data-tablepcwidth="100" type-data-tablepcwidth="number" data-colcount="2" type-data-colcount="number" data-rowcount="4" type-data-rowcount="number" data-cols=">a,e"><colgroup><col data-halign="right" data-width="1" data-style="asciidoc" data-colnumber="1" data-valign="top" data-colpcwidth="50"/><col data-width="1" data-style="emphasis" data-colnumber="2" data-halign="left" data-valign="top" data-colpcwidth="50"/></colgroup><thead><tr><th data-halign="right" data-width="1" data-style="asciidoc" data-colnumber="1" data-valign="top" data-colpcwidth="50">Column 1, header row</th><th data-width="1" data-style="emphasis" data-colnumber="2" data-halign="left" data-valign="top" data-colpcwidth="50">Column 2, header row</th></tr></thead><tbody><tr><td data-halign="right" data-width="1" data-style="asciidoc" data-colnumber="1" data-valign="top" data-colpcwidth="50"><article adoc-name="document"><p adoc-name="paragraph">monospaced</p></article></td><td data-width="1" data-style="emphasis" data-colnumber="2" data-halign="left" data-valign="top" data-colpcwidth="50"><em adoc-name="inline_quoted" prop-type="emphasis" prop-alt="">monospaced</em></td></tr><tr><td data-halign="right" data-width="1" data-style="strong" data-colnumber="1" data-valign="top" data-colpcwidth="50"><strong adoc-name="inline_quoted" prop-type="strong" prop-alt="">strong</strong></td><td data-width="1" data-style="emphasis" data-colnumber="2" data-halign="left" data-valign="top" data-colpcwidth="50"><em adoc-name="inline_quoted" prop-type="emphasis" prop-alt=""><strong adoc-name="inline_quoted" prop-type="strong" prop-alt="">strong</strong></em></td></tr><tr><td data-halign="right" data-width="1" data-style="asciidoc" data-colnumber="1" data-valign="top" data-colpcwidth="50"><article adoc-name="document"><p adoc-name="paragraph">default</p></article></td><td data-width="1" data-style="emphasis" data-colnumber="2" data-halign="left" data-valign="top" data-colpcwidth="50"><em adoc-name="inline_quoted" prop-type="emphasis" prop-alt="">monospaced</em></td></tr></tbody></table></article>`;
  static readonly tableOverrideStyleNormalized = this.tableOverrideStyleAdoc;
  static readonly tableAdocBlockInCellAdoc = `|===
|Normal Style |AsciiDoc Style

|This cell is not prefixed with an a, so the processor does not interpret the following lines as an AsciiDoc list.

* List item 1
* List item 2
* List item 3

a|This cell is prefixed with an a, so the processor interprets the following lines as an AsciiDoc list.

* List item 1
* List item 2
* List item 3

|This cell is not prefixed with an a, so the processor does not interpret the listing block delimiters or the source style.

[source,python]
----
import os
print ("%s" %(os.uname()))
----

a|This cell is prefixed with an \`a\`, so the listing block is processed and rendered according to the \`source\` style rules.

[source,python]
----
import os
print "%s" %(os.uname())
----

|===`;
  static readonly tableAdocBlockInCellAdocCn = `|===
|译Normal Style |译AsciiDoc Style

|译This cell is not prefixed with an a, so the processor does not interpret the following lines as an AsciiDoc list.

译* List item 1
译* List item 2
译* List item 3

a|译This cell is prefixed with an a, so the processor interprets the following lines as an AsciiDoc list.

* 译List item 1
* 译List item 2
* 译List item 3

|译This cell is not prefixed with an a, so the processor does not interpret the listing block delimiters or the source style.

译[source,python]
----
译import os
译print ("%s" %(os.uname()))
----

a|译This cell is prefixed with an \`a\`译, so the listing block is processed and rendered according to the \`source\`译 style rules.

[source,python]
----
import os
print "%s" %(os.uname())
----

|===`;
  static readonly tableAdocBlockInCellHtml = `<table class="tableblock frame-all grid-all stretch">
<colgroup>
<col style="width: 50%;">
<col style="width: 50%;">
</colgroup>
<thead>
<tr>
<th class="tableblock halign-left valign-top">Normal Style</th>
<th class="tableblock halign-left valign-top">AsciiDoc Style</th>
</tr>
</thead>
<tbody>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock">This cell is not prefixed with an a, so the processor does not interpret the following lines as an AsciiDoc list.</p>
<p class="tableblock">* List item 1
* List item 2
* List item 3</p></td>
<td class="tableblock halign-left valign-top"><div class="content"><div class="paragraph">
<p>This cell is prefixed with an a, so the processor interprets the following lines as an AsciiDoc list.</p>
</div>
<div class="ulist">
<ul>
<li>
<p>List item 1</p>
</li>
<li>
<p>List item 2</p>
</li>
<li>
<p>List item 3</p>
</li>
</ul>
</div></div></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock">This cell is not prefixed with an a, so the processor does not interpret the listing block delimiters or the source style.</p>
<p class="tableblock">[source,python]
----
import os
print ("%s" %(os.uname()))
----</p></td>
<td class="tableblock halign-left valign-top"><div class="content"><div class="paragraph">
<p>This cell is prefixed with an <code>a</code>, so the listing block is processed and rendered according to the <code>source</code> style rules.</p>
</div>
<div class="listingblock">
<div class="content">
<pre class="highlight"><code class="language-python" data-lang="python">import os
print "%s" %(os.uname())</code></pre>
</div>
</div></div></td>
</tr>
</tbody>
</table>`;
  static readonly tableAdocBlockInCellTiny = `<article adoc-name="document"><table adoc-name="table" attr-RowCount="3" type-attr-RowCount="number" attr-ColumnCount="2" type-attr-ColumnCount="number" attr-Style="table" data-tablepcwidth="100" type-data-tablepcwidth="number" data-colcount="2" type-data-colcount="number" data-rowcount="3" type-data-rowcount="number"><colgroup><col data-colnumber="1" data-width="1" data-halign="left" data-valign="top" data-colpcwidth="50"/><col data-colnumber="2" data-width="1" data-halign="left" data-valign="top" data-colpcwidth="50"/></colgroup><thead><tr><th data-colnumber="1" data-width="1" data-halign="left" data-valign="top">Normal Style</th><th data-colnumber="2" data-width="1" data-halign="left" data-valign="top">AsciiDoc Style</th></tr></thead><tbody><tr><td data-colnumber="1" data-width="1" data-halign="left" data-valign="top">This cell is not prefixed with an a, so the processor does not interpret the following lines as an AsciiDoc list.,* List item 1
* List item 2
* List item 3</td><td data-colnumber="2" data-width="1" data-halign="left" data-valign="top" data-style="asciidoc"><article adoc-name="document"><p adoc-name="paragraph">This cell is prefixed with an a, so the processor interprets the following lines as an AsciiDoc list.</p><ul adoc-name="ulist"><li adoc-name="list_item" attr-Text="List item 1" attr-Marker="*">List item 1</li><li adoc-name="list_item" attr-Text="List item 2" attr-Marker="*">List item 2</li><li adoc-name="list_item" attr-Text="List item 3" attr-Marker="*">List item 3</li></ul></article></td></tr><tr><td data-colnumber="1" data-width="1" data-halign="left" data-valign="top">This cell is not prefixed with an a, so the processor does not interpret the listing block delimiters or the source style.,[source,python]
----
import os
print ("%s" %(os.uname()))
----</td><td data-colnumber="2" data-width="1" data-halign="left" data-valign="top" data-style="asciidoc"><article adoc-name="document"><p adoc-name="paragraph">This cell is prefixed with an <code adoc-name="inline_quoted" prop-type="monospaced" prop-alt="">a</code>, so the listing block is processed and rendered according to the <code adoc-name="inline_quoted" prop-type="monospaced" prop-alt="">source</code> style rules.</p><code adoc-name="listing" attr-Style="source" data-language="python">import os
print "%s" %(os.uname())</code></article></td></tr></tbody></table></article>`;
  static readonly tableAdocBlockInCellNormalized = this.tableAdocBlockInCellAdoc;
  static readonly tableColSpanAndRowSpanAdoc = `|===
|Column 1, header row |Column 2, header row |Column 3, header row |Column 4, header row

|Cell in column 1, row 2
2.3+|This cell spans columns 2 and 3 and rows 2, 3, and 4 because its specifier contains a span of 2.3+
|Cell in column 4, row 2

|Cell in column 1, row 3
|Cell in column 4, row 3

|Cell in column 1, row 4
|Cell in column 4, row 4
|===`;
  static readonly tableColSpanAndRowSpanAdocCn = `|===
|译Column 1, header row |译Column 2, header row |译Column 3, header row |译Column 4, header row

|译Cell in column 1, row 2
2.3+|译This cell spans columns 2 and 3 and rows 2, 3, and 4 because its specifier contains a span of 2.3+
|译Cell in column 4, row 2

|译Cell in column 1, row 3
|译Cell in column 4, row 3

|译Cell in column 1, row 4
|译Cell in column 4, row 4
|===`;
  static readonly tableColSpanAndRowSpanHtml = `<table class="tableblock frame-all grid-all stretch">
<colgroup>
<col style="width: 25%;">
<col style="width: 25%;">
<col style="width: 25%;">
<col style="width: 25%;">
</colgroup>
<thead>
<tr>
<th class="tableblock halign-left valign-top">Column 1, header row</th>
<th class="tableblock halign-left valign-top">Column 2, header row</th>
<th class="tableblock halign-left valign-top">Column 3, header row</th>
<th class="tableblock halign-left valign-top">Column 4, header row</th>
</tr>
</thead>
<tbody>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 1, row 2</p></td>
<td class="tableblock halign-left valign-top" colspan="2" rowspan="3"><p class="tableblock">This cell spans columns 2 and 3 and rows 2, 3, and 4 because its specifier contains a span of 2.3+</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 4, row 2</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 1, row 3</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 4, row 3</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 1, row 4</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 4, row 4</p></td>
</tr>
</tbody>
</table>`;
  static readonly tableColSpanAndRowSpanTiny = `<article adoc-name="document"><table adoc-name="table" attr-RowCount="4" type-attr-RowCount="number" attr-ColumnCount="4" type-attr-ColumnCount="number" attr-Style="table" data-tablepcwidth="100" type-data-tablepcwidth="number" data-colcount="4" type-data-colcount="number" data-rowcount="4" type-data-rowcount="number"><colgroup><col data-colnumber="1" data-width="1" data-halign="left" data-valign="top" data-colpcwidth="25"/><col data-colnumber="2" data-width="1" data-halign="left" data-valign="top" data-colpcwidth="25"/><col data-colnumber="3" data-width="1" data-halign="left" data-valign="top" data-colpcwidth="25"/><col data-colnumber="4" data-width="1" data-halign="left" data-valign="top" data-colpcwidth="25"/></colgroup><thead><tr><th data-colnumber="1" data-width="1" data-halign="left" data-valign="top">Column 1, header row</th><th data-colnumber="2" data-width="1" data-halign="left" data-valign="top">Column 2, header row</th><th data-colnumber="3" data-width="1" data-halign="left" data-valign="top">Column 3, header row</th><th data-colnumber="4" data-width="1" data-halign="left" data-valign="top">Column 4, header row</th></tr></thead><tbody><tr><td data-colnumber="1" data-width="1" data-halign="left" data-valign="top">Cell in column 1, row 2</td><td data-colspan=2 data-rowspan=3 data-colnumber="2" data-width="1" data-halign="left" data-valign="top">This cell spans columns 2 and 3 and rows 2, 3, and 4 because its specifier contains a span of 2.3+</td><td data-colnumber="3" data-width="1" data-halign="left" data-valign="top">Cell in column 4, row 2</td></tr><tr><td data-colnumber="1" data-width="1" data-halign="left" data-valign="top">Cell in column 1, row 3</td><td data-colnumber="2" data-width="1" data-halign="left" data-valign="top">Cell in column 4, row 3</td></tr><tr><td data-colnumber="1" data-width="1" data-halign="left" data-valign="top">Cell in column 1, row 4</td><td data-colnumber="2" data-width="1" data-halign="left" data-valign="top">Cell in column 4, row 4</td></tr></tbody></table></article>`;
  static readonly tableColSpanAndRowSpanNormalized = this.tableColSpanAndRowSpanAdoc;
  static readonly tableWidthAdoc = `[%autowidth.stretch]
|===
|Column 1, header row |Column 2, header row |Column 3, header row

|Cell in column 1, row 2
|Cell in column 2, row 2
|Cell in column 3, row 2

|Cell in column 1, row 3
|Cell in column 2, row 3
|Cell in column 3, row 3
|===`;
  static readonly tableWidthAdocCn = `[%autowidth.stretch]
|===
|译Column 1, header row |译Column 2, header row |译Column 3, header row

|译Cell in column 1, row 2
|译Cell in column 2, row 2
|译Cell in column 3, row 2

|译Cell in column 1, row 3
|译Cell in column 2, row 3
|译Cell in column 3, row 3
|===`;
  static readonly tableWidthHtml = `<table class="tableblock frame-all grid-all fit-content stretch">
<colgroup>
<col>
<col>
<col>
</colgroup>
<thead>
<tr>
<th class="tableblock halign-left valign-top">Column 1, header row</th>
<th class="tableblock halign-left valign-top">Column 2, header row</th>
<th class="tableblock halign-left valign-top">Column 3, header row</th>
</tr>
</thead>
<tbody>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 1, row 2</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 2, row 2</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 3, row 2</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 1, row 3</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 2, row 3</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Cell in column 3, row 3</p></td>
</tr>
</tbody>
</table>`;
  static readonly tableWidthTiny = `<article adoc-name="document"><table adoc-name="table" attr-RowCount="3" type-attr-RowCount="number" attr-ColumnCount="3" type-attr-ColumnCount="number" attr-Style="table" data-tablepcwidth="100" type-data-tablepcwidth="number" data-colcount="3" type-data-colcount="number" data-rowcount="3" type-data-rowcount="number" data-role="stretch" data-autowidth-option=""><colgroup><col data-colnumber="1" data-width="1" data-halign="left" data-valign="top" data-colpcwidth="33.3333"/><col data-colnumber="2" data-width="1" data-halign="left" data-valign="top" data-colpcwidth="33.3333"/><col data-colnumber="3" data-width="1" data-halign="left" data-valign="top" data-colpcwidth="33.3334"/></colgroup><thead><tr><th data-colnumber="1" data-width="1" data-halign="left" data-valign="top">Column 1, header row</th><th data-colnumber="2" data-width="1" data-halign="left" data-valign="top">Column 2, header row</th><th data-colnumber="3" data-width="1" data-halign="left" data-valign="top">Column 3, header row</th></tr></thead><tbody><tr><td data-colnumber="1" data-width="1" data-halign="left" data-valign="top">Cell in column 1, row 2</td><td data-colnumber="2" data-width="1" data-halign="left" data-valign="top">Cell in column 2, row 2</td><td data-colnumber="3" data-width="1" data-halign="left" data-valign="top">Cell in column 3, row 2</td></tr><tr><td data-colnumber="1" data-width="1" data-halign="left" data-valign="top">Cell in column 1, row 3</td><td data-colnumber="2" data-width="1" data-halign="left" data-valign="top">Cell in column 2, row 3</td><td data-colnumber="3" data-width="1" data-halign="left" data-valign="top">Cell in column 3, row 3</td></tr></tbody></table></article>`;
  static readonly tableWidthNormalized = this.tableWidthAdoc;
  static readonly tableCustomSeparatorAdoc = `[cols=2*,separator=¦]
|===
¦The default separator in PSV tables is the | character.
¦The | character is often referred to as a pipe.
|===`;
  static readonly tableCustomSeparatorAdocCn = `[cols=2*,separator=¦]
|===
¦译The default separator in PSV tables is the | character.
¦译The | character is often referred to as a pipe.
|===`;
  static readonly tableCustomSeparatorHtml = `<table class="tableblock frame-all grid-all stretch">
<colgroup>
<col style="width: 50%;">
<col style="width: 50%;">
</colgroup>
<tbody>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock">The default separator in PSV tables is the | character.</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">The | character is often referred to as a pipe.</p></td>
</tr>
</tbody>
</table>`;
  static readonly tableCustomSeparatorTiny = `<article adoc-name="document"><table adoc-name="table" attr-RowCount="1" type-attr-RowCount="number" attr-ColumnCount="2" type-attr-ColumnCount="number" attr-Style="table" data-tablepcwidth="100" type-data-tablepcwidth="number" data-colcount="2" type-data-colcount="number" data-rowcount="1" type-data-rowcount="number" data-cols="2*" data-separator="¦"><colgroup><col data-width="1" data-colnumber="1" data-halign="left" data-valign="top" data-colpcwidth="50"/><col data-width="1" data-colnumber="2" data-halign="left" data-valign="top" data-colpcwidth="50"/></colgroup><tbody><tr><td data-width="1" data-colnumber="1" data-halign="left" data-valign="top" data-colpcwidth="50">The default separator in PSV tables is the | character.</td><td data-width="1" data-colnumber="2" data-halign="left" data-valign="top" data-colpcwidth="50">The | character is often referred to as a pipe.</td></tr></tbody></table></article>`;
  static readonly tableCustomSeparatorNormalized = this.tableCustomSeparatorAdoc;
  static readonly tableCsvAdoc = `[%header,format=csv]
|===
Artist,Track,Genre
Baauer,Harlem Shake,Hip Hop
The Lumineers,Ho Hey,Folk Rock
|===`;
  static readonly tableCsvAdocCn = `[%header,format=csv]
|===
|译Artist |译Track |译Genre

|译Baauer
|译Harlem Shake
|译Hip Hop

|译The Lumineers
|译Ho Hey
|译Folk Rock
|===`;
  static readonly tableCsvHtml = `<table class="tableblock frame-all grid-all stretch">
<colgroup>
<col style="width: 33.3333%;">
<col style="width: 33.3333%;">
<col style="width: 33.3334%;">
</colgroup>
<thead>
<tr>
<th class="tableblock halign-left valign-top">Artist</th>
<th class="tableblock halign-left valign-top">Track</th>
<th class="tableblock halign-left valign-top">Genre</th>
</tr>
</thead>
<tbody>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock">Baauer</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Harlem Shake</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Hip Hop</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock">The Lumineers</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Ho Hey</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Folk Rock</p></td>
</tr>
</tbody>
</table>`;
  static readonly tableCsvTiny = `<article adoc-name="document"><table adoc-name="table" attr-RowCount="3" type-attr-RowCount="number" attr-ColumnCount="3" type-attr-ColumnCount="number" attr-Style="table" data-tablepcwidth="100" type-data-tablepcwidth="number" data-colcount="3" type-data-colcount="number" data-rowcount="3" type-data-rowcount="number" data-format="csv" data-header-option=""><colgroup><col data-colnumber="1" data-width="1" data-halign="left" data-valign="top" data-colpcwidth="33.3333"/><col data-colnumber="2" data-width="1" data-halign="left" data-valign="top" data-colpcwidth="33.3333"/><col data-colnumber="3" data-width="1" data-halign="left" data-valign="top" data-colpcwidth="33.3334"/></colgroup><thead><tr><th data-colnumber="1" data-width="1" data-halign="left" data-valign="top">Artist</th><th data-colnumber="2" data-width="1" data-halign="left" data-valign="top">Track</th><th data-colnumber="3" data-width="1" data-halign="left" data-valign="top">Genre</th></tr></thead><tbody><tr><td data-colnumber="1" data-width="1" data-halign="left" data-valign="top">Baauer</td><td data-colnumber="2" data-width="1" data-halign="left" data-valign="top">Harlem Shake</td><td data-colnumber="3" data-width="1" data-halign="left" data-valign="top">Hip Hop</td></tr><tr><td data-colnumber="1" data-width="1" data-halign="left" data-valign="top">The Lumineers</td><td data-colnumber="2" data-width="1" data-halign="left" data-valign="top">Ho Hey</td><td data-colnumber="3" data-width="1" data-halign="left" data-valign="top">Folk Rock</td></tr></tbody></table></article>`;
  static readonly tableCsvNormalized = this.tableCsvAdoc;
  static readonly tableEscapePipeCharAdoc = `|===
|header 1 with '\\|' |header 2 without \\|

|body with \\| 1
|body with \`\\| 2\`
|===`;
  static readonly tableEscapePipeCharAdocCn = `|===
|译header 1 with '\\|' |译header 2 without \\|

|译body with \\| 1
|译body with \`\\| 2\`
|===`;
  static readonly tableEscapePipeCharHtml = `<table class="tableblock frame-all grid-all stretch">
<colgroup>
<col style="width: 50%;">
<col style="width: 50%;">
</colgroup>
<thead>
<tr>
<th class="tableblock halign-left valign-top">header 1 with '|'</th>
<th class="tableblock halign-left valign-top">header 2 without |</th>
</tr>
</thead>
<tbody>
<tr>
<td class="tableblock halign-left valign-top"><p class="tableblock">body with | 1</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">body with <code>| 2</code></p></td>
</tr>
</tbody>
</table>`;
  static readonly tableEscapePipeCharTiny = `<article adoc-name="document"><table adoc-name="table" attr-RowCount="2" type-attr-RowCount="number" attr-ColumnCount="2" type-attr-ColumnCount="number" attr-Style="table" data-tablepcwidth="100" type-data-tablepcwidth="number" data-colcount="2" type-data-colcount="number" data-rowcount="2" type-data-rowcount="number"><colgroup><col data-colnumber="1" data-width="1" data-halign="left" data-valign="top" data-colpcwidth="50"/><col data-colnumber="2" data-width="1" data-halign="left" data-valign="top" data-colpcwidth="50"/></colgroup><thead><tr><th data-colnumber="1" data-width="1" data-halign="left" data-valign="top">header 1 with '|'</th><th data-colnumber="2" data-width="1" data-halign="left" data-valign="top">header 2 without |</th></tr></thead><tbody><tr><td data-colnumber="1" data-width="1" data-halign="left" data-valign="top">body with | 1</td><td data-colnumber="2" data-width="1" data-halign="left" data-valign="top">body with <code adoc-name="inline_quoted" prop-type="monospaced" prop-alt="">| 2</code></td></tr></tbody></table></article>`;
  static readonly tableEscapePipeCharNormalized = this.tableEscapePipeCharAdoc;
  static readonly stemInlineAdoc = `stem:[sqrt(4) = 2]

Water (stem:[H_2O]) is a critical component.`;
  static readonly stemInlineAdocCn = `stem:[sqrt(4) = 2]

译Water (stem:[H_2O]译) is a critical component.`;
  static readonly stemInlineHtml = `<div class="paragraph">
<p>\\$sqrt(4) = 2\\$</p>
</div>
<div class="paragraph">
<p>Water (\\$H_2O\\$) is a critical component.</p>
</div>`;
  static readonly stemInlineTiny = `<article adoc-name="document"><p adoc-name="paragraph"><code adoc-name="inline_quoted" prop-type="asciimath" prop-alt="">sqrt(4) = 2</code></p><p adoc-name="paragraph">Water (<code adoc-name="inline_quoted" prop-type="asciimath" prop-alt="">H_2O</code>) is a critical component.</p></article>`;
  static readonly stemInlineNormalized = this.stemInlineAdoc;
  static readonly stemBlockAdoc = `[stem]
++++
sqrt(4) = 2
++++`;
  static readonly stemBlockAdocCn = `[stem]
++++
sqrt(4) = 2
++++`;
  static readonly stemBlockHtml = `<div class="stemblock">
<div class="content">
\\$sqrt(4) = 2\\$
</div>
</div>`;
  static readonly stemBlockTiny = `<article adoc-name="document"><blockquote adoc-name="stem" attr-Style="asciimath">sqrt(4) = 2</blockquote></article>`;
  static readonly stemBlockNormalized = this.stemBlockAdoc;
  static readonly stemMixedAdoc = `= My Diabolical Mathmatical Opus
Jamie Moriarty
:stem: latexmath

[asciimath]
++++
sqrt(4) = 2
++++`;
  static readonly stemMixedAdocCn = `= 译My Diabolical Mathmatical Opus
Jamie Moriarty
:stem: latexmath

[asciimath]
++++
sqrt(4) = 2
++++`;
  static readonly stemMixedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="generator" content="Asciidoctor 2.0.17">
<meta name="author" content="Jamie Moriarty">
<title>My Diabolical Mathmatical Opus</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:300,300italic,400,400italic,600,600italic%7CNoto+Serif:400,400italic,700,700italic%7CDroid+Sans+Mono:400,700">
<link rel="stylesheet" href="./asciidoctor.css">
</head>
<body class="article">
<div id="header">
<h1>My Diabolical Mathmatical Opus</h1>
<div class="details">
<span id="author" class="author">Jamie Moriarty</span><br>
</div>
</div>
<div id="content">
<div class="stemblock">
<div class="content">
\\$sqrt(4) = 2\\$
</div>
</div>
</div>
<div id="footer">
<div id="footer-text">
Last updated 2000-01-01 00:00:00 +0000
</div>
</div>
<script type="text/x-mathjax-config">
MathJax.Hub.Config({
  messageStyle: "none",
  tex2jax: {
    inlineMath: [["\\\\(", "\\\\)"]],
    displayMath: [["\\\\[", "\\\\]"]],
    ignoreClass: "nostem|nolatexmath"
  },
  asciimath2jax: {
    delimiters: [["\\\\$", "\\\\$"]],
    ignoreClass: "nostem|noasciimath"
  },
  TeX: { equationNumbers: { autoNumber: "none" } }
})
MathJax.Hub.Register.StartupHook("AsciiMath Jax Ready", function () {
  MathJax.InputJax.AsciiMath.postfilterHooks.Add(function (data, node) {
    if ((node = data.script.parentNode) && (node = node.parentNode) && node.classList.contains("stemblock")) {
      data.math.root.display = "block"
    }
    return data
  })
})
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_HTMLorMML"></script>
</body>
</html>`;
  static readonly stemMixedTiny = `<article adoc-name="document" data-doctitle="My Diabolical Mathmatical Opus" data-authorcount="1" type-data-authorcount="number" data-firstname="Jamie" data-authorinitials="JM" data-lastname="Moriarty" data-author="Jamie Moriarty" data-authors="Jamie Moriarty" data-stem="latexmath"><blockquote adoc-name="stem" attr-Style="asciimath">sqrt(4) = 2</blockquote></article>`;
  static readonly stemMixedNormalized = this.stemMixedAdoc;
  static readonly openBlockSimpleAdoc = `--
An open block can be an anonymous container,
or it can masquerade as any other block.
--`;
  static readonly openBlockSimpleAdocCn = `--
译An open block can be an anonymous container,
译or it can masquerade as any other block.
--`;
  static readonly openBlockSimpleHtml = `<div class="openblock">
<div class="content">
<div class="paragraph">
<p>An open block can be an anonymous container,
or it can masquerade as any other block.</p>
</div>
</div>
</div>`;
  static readonly openBlockSimpleTiny = `<article adoc-name="document"><div adoc-name="open" attr-Style="open"><p adoc-name="paragraph">An open block can be an anonymous container,
or it can masquerade as any other block.</p></div></article>`;
  static readonly openBlockSimpleNormalized = this.openBlockSimpleAdoc;
  static readonly openBlockComplexAdoc = `[sidebar]
.Related information
--
This is aside text.

It is used to present information related to the main content.
--`;
  static readonly openBlockComplexAdocCn = `.译Related information
****
译This is aside text.

译It is used to present information related to the main content.
****`;
  static readonly openBlockComplexHtml = `<div class="sidebarblock">
<div class="content">
<div class="title">Related information</div>
<div class="paragraph">
<p>This is aside text.</p>
</div>
<div class="paragraph">
<p>It is used to present information related to the main content.</p>
</div>
</div>
</div>`;
  static readonly openBlockComplexTiny = `<article adoc-name="document"><aside adoc-name="sidebar" attr-Title="Related information" attr-Style="sidebar" data-title="Related information"><p adoc-name="paragraph">This is aside text.</p><p adoc-name="paragraph">It is used to present information related to the main content.</p></aside></article>`;
  static readonly openBlockComplexNormalized = this.openBlockComplexAdoc;
  static readonly includeSimpleAdoc = `include::./test/fixtures/include.adoc[]`;
  static readonly includeSimpleAdocCn = `include::./test/fixtures/include.adoc[]`;
  static readonly includeSimpleHtml = `<div class="paragraph">
<p><a href="./test/fixtures/include.adoc" class="bare">./test/fixtures/include.adoc</a></p>
</div>`;
  static readonly includeSimpleTiny = `<article adoc-name="document"><p adoc-name="paragraph"><code adoc-name="inline_quoted" prop-type="monospaced" prop-alt="">begin-directive:[include::./test/fixtures/include.adoc[]]end-directive</code></p></article>`;
  static readonly includeSimpleNormalized = this.includeSimpleAdoc;
  static readonly includeWithAttributesAdoc = `include::filename.txt[lines="1..10,15..20"]`;
  static readonly includeWithAttributesAdocCn = `include::filename.txt[lines="1..10,15..20"]`;
  static readonly includeWithAttributesHtml = `<div class="paragraph">
<p><a href="filename.txt" class="bare">filename.txt</a></p>
</div>`;
  static readonly includeWithAttributesTiny = `<article adoc-name="document"><p adoc-name="paragraph"><code adoc-name="inline_quoted" prop-type="monospaced" prop-alt="">begin-directive:[include::filename.txt[lines="1..10,15..20"]]end-directive</code></p></article>`;
  static readonly includeWithAttributesNormalized = this.includeWithAttributesAdoc;
  static readonly includeUnresolvedDirectiveAdoc = `include::{docs-groovy}/cli/usingthecli/run/WebApplication.groovy[tag=*]`;
  static readonly includeUnresolvedDirectiveAdocCn = `include::{docs-groovy}/cli/usingthecli/run/WebApplication.groovy[tag=*]`;
  static readonly includeUnresolvedDirectiveHtml = `<div class="paragraph">
<p><a href="{docs-groovy}/cli/usingthecli/run/WebApplication.groovy" class="bare">{docs-groovy}/cli/usingthecli/run/WebApplication.groovy</a></p>
</div>`;
  static readonly includeUnresolvedDirectiveTiny = `<article adoc-name="document"><p adoc-name="paragraph"><code adoc-name="inline_quoted" prop-type="monospaced" prop-alt="">begin-directive:[include::{docs-groovy}/cli/usingthecli/run/WebApplication.groovy[tag=*]]end-directive</code></p></article>`;
  static readonly includeUnresolvedDirectiveNormalized = this.includeUnresolvedDirectiveAdoc;
  static readonly escapeSimpleAdoc = `TIP: Spring Boot's -- "\`JarFile\`" '\`JarFile\`' Class: \`\`abc\`\`
<ab>&`;
  static readonly escapeSimpleAdocCn = `TIP: 译Spring Boot's -- "\`译JarFile\`" '\`译JarFile\`'译 Class: \`abc\`
译<ab>&`;
  static readonly escapeSimpleHtml = `<div class="admonitionblock tip">
<table>
<tr>
<td class="icon">
<div class="title">Tip</div>
</td>
<td class="content">
Spring Boot&#8217;s&#8201;&#8212;&#8201;&#8220;JarFile&#8221; &#8216;JarFile&#8217; Class: <code>abc</code>
&lt;ab&gt;&amp;
</td>
</tr>
</table>
</div>`;
  static readonly escapeSimpleTiny = `<article adoc-name="document"><figure adoc-name="admonition" attr-Style="TIP" attr-Caption="Tip" data-name="tip" data-textlabel="Tip">Spring Boot's -- <span adoc-name="inline_quoted" prop-type="double" prop-alt="">JarFile</span> <span adoc-name="inline_quoted" prop-type="single" prop-alt="">JarFile</span> Class: <code adoc-name="inline_quoted" prop-type="monospaced" prop-alt="">abc</code>
&lt;ab&gt;&amp;</figure></article>`;
  static readonly escapeSimpleNormalized = this.escapeSimpleAdoc;
  static readonly escapePlusAdoc = `TIP: properties such as \`+logging.*+\` and \`+++spring.main.*+++\``;
  static readonly escapePlusAdocCn = `TIP: 译properties such as \`logging.*\`译 and \`spring.main.*\``;
  static readonly escapePlusHtml = `<div class="admonitionblock tip">
<table>
<tr>
<td class="icon">
<div class="title">Tip</div>
</td>
<td class="content">
properties such as <code>logging.*</code> and <code>spring.main.*</code>
</td>
</tr>
</table>
</div>`;
  static readonly escapePlusTiny = `<article adoc-name="document"><figure adoc-name="admonition" attr-Style="TIP" attr-Caption="Tip" data-name="tip" data-textlabel="Tip">properties such as <code adoc-name="inline_quoted" prop-type="monospaced" prop-alt="">logging.*</code> and <code adoc-name="inline_quoted" prop-type="monospaced" prop-alt="">spring.main.*</code></figure></article>`;
  static readonly escapePlusNormalized = this.escapePlusAdoc;
  static readonly escapeStarStarAdoc = `TIP: **bold**`;
  static readonly escapeStarStarAdocCn = `TIP: *译bold*`;
  static readonly escapeStarStarHtml = `<div class="admonitionblock tip">
<table>
<tr>
<td class="icon">
<div class="title">Tip</div>
</td>
<td class="content">
<strong>bold</strong>
</td>
</tr>
</table>
</div>`;
  static readonly escapeStarStarTiny = `<article adoc-name="document"><figure adoc-name="admonition" attr-Style="TIP" attr-Caption="Tip" data-name="tip" data-textlabel="Tip"><strong adoc-name="inline_quoted" prop-type="strong" prop-alt="">bold</strong></figure></article>`;
  static readonly escapeStarStarNormalized = this.escapeStarStarAdoc;
  static readonly escapeDollarBraceAdoc = `TIP: \${foo}`;
  static readonly escapeDollarBraceAdocCn = `TIP: 译\${foo}`;
  static readonly escapeDollarBraceHtml = `<div class="admonitionblock tip">
<table>
<tr>
<td class="icon">
<div class="title">Tip</div>
</td>
<td class="content">
\${foo}
</td>
</tr>
</table>
</div>`;
  static readonly escapeDollarBraceTiny = `<article adoc-name="document"><figure adoc-name="admonition" attr-Style="TIP" attr-Caption="Tip" data-name="tip" data-textlabel="Tip">\${foo}</figure></article>`;
  static readonly escapeDollarBraceNormalized = this.escapeDollarBraceAdoc;
  static readonly conditionalDirectiveAdoc = `ifeval::["{spring-boot-artifactory-repo}" != "release"]

=== Section Title

endif::[]`;
  static readonly conditionalDirectiveAdocCn = `ifeval::["{spring-boot-artifactory-repo}" != "release"]

=== 译Section Title

endif::[]`;
  static readonly conditionalDirectiveHtml = `<div class="sect2">
<h3 id="_section_title">Section Title</h3>

</div>`;
  static readonly conditionalDirectiveTiny = `<article adoc-name="document"><p adoc-name="paragraph"><code adoc-name="inline_quoted" prop-type="monospaced" prop-alt="">begin-directive:[ifeval::["{spring-boot-artifactory-repo}" != "release"]]end-directive</code></p><section adoc-name="section" attr-Level="2" type-attr-Level="number" attr-SectionName="section" attr-Title="Section Title" attr-Id="_section_title"><p adoc-name="paragraph"><code adoc-name="inline_quoted" prop-type="monospaced" prop-alt="">begin-directive:[endif::[]]end-directive</code></p></section></article>`;
  static readonly conditionalDirectiveNormalized = this.conditionalDirectiveAdoc;
}
