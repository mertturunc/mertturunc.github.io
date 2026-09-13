---
category: blog
title: "markdown showdown"
published: false
starred: false
d3: true
---

a kitchen sink for every kramdown and inline html bit the post layout should survive. unpublished on purpose.

## contents
{: .no_toc}

- this list is replaced by a table of contents
{:toc}

## headings

the page title is already an h1. these are extra levels, kept out of the contents list.

# This is an h1
{:.no_toc}
## This is an h2
{:.no_toc}
### This is an h3
{:.no_toc}
#### This is an h4
{:.no_toc}
##### This is an h5
{:.no_toc}
###### This is an h6
{:.no_toc}

## paragraphs and breaks

a normal paragraph with enough words to wrap in the 700px well, so we can see the 18px / 28px measure hold.

a hard line break after this  
then the next line, still in the same paragraph.

two spaces at the end of a line should break. a blank line starts a new paragraph.

## inline text

*italic with asterisks* and _italic with underscores_.

**bold with asterisks** and __bold with underscores__.

*you **can** nest them*.

<del>deleted</del>, <ins>inserted</ins>, <mark>marked</mark>, <small>small</small>.

H<sub>2</sub>O and e = mc<sup>2</sup>. a footnote sits on the sentence.[^1]

<abbr title="hypertext markup language">html</abbr> with a title, <cite>a cited title</cite>, <q>a short quotation</q>, <dfn>a defining instance</dfn>, and <time datetime="2020-01-01">january 1, 2020</time>.

inline `code`, a key <kbd>ctrl</kbd>+<kbd>k</kbd>, sample output <samp>hello</samp>, and a variable <var>n</var>.

autolink: <https://blog.atr0p.dev>

inline link: [while around here](https://blog.atr0p.dev "the desk").

reference link: [the same desk][desk].

[desk]: https://blog.atr0p.dev "while around here"

named email is not a form. escape: \*literal asterisks\* and `\_no emphasis\_`.

## blockquotes

As Grace Hopper said:

> i’ve always been more interested
> in the future than in the past.

nested:

> outer note.
>
> > inner note, still on the same paper.
>
> back to the outer note, with a [link](https://blog.atr0p.dev) and `code`.

## lists

unordered:

* Item 1
* Item 2
  * Item 2a
  * Item 2b
* Item 3 with `code` and a [link](https://blog.atr0p.dev)

ordered:

1. Item 1
2. Item 2
3. Item 3
   1. Item 3a
   2. Item 3b
4. Item 4 wrapping onto two lines so we can see the marker stay put while the text wraps in the well.

mixed:

1. numbered parent
   * square child
   * another child
2. back to numbers

task list:

- [x] this is a complete item
- [ ] this is an incomplete item
- [x] @mentions, #refs, [links](),
**formatting**, and <del>tags</del>
supported
- [x] list syntax required (any
unordered or ordered list
supported)

ol starting later:

<ol start="5">
<li>five</li>
<li>six</li>
</ol>

## code

inline in a sentence: `const x = 1`.

indented block:

    function indented() {
      return true;
    }

fenced, a few languages the chip map already knows:

```javascript
function test() {
  console.log("look ma’, no spaces");
}
```

```python
def fibonacci(n):
    a, b = 0, 1
    while a < n:
        print(a, end=' ')
        a, b = b, a + b
```

```css
.highlight {
  background: var(--code-bg);
  border-radius: 4px;
}
```

```bash
npm install
npm run dev
```

```html
<p class="lede">a note on paper</p>
```

```json
{ "desk": "while around here", "open": true }
```

```sql
select title, date from posts where starred is true;
```

```yaml
layout: post
d3: true
```

```text
plain text, no language costume.
```

inside a list:

* a fence in a list item:

  ```javascript
  const inList = true;
  ```

* then the next item.

## tables

default:

First Header | Second Header | Third Header
------------ | ------------- | ------------
Content cell 1 | Content cell 2 | Content cell 3
Content column 1 | Content column 2 | Content column 3
**Bold content** | *Italic content* | `Code content`
Long content that might wrap to multiple lines | Short | Medium length content

aligned:

| left | center | right |
|:-----|:------:|------:|
| ink | accent | muted |
| 12 | 3.14 | 900 |
| `code` | **bold** | [link](https://blog.atr0p.dev) |

## rules

above the line.

---

below the line.

***

## images and figures

inline image with alt:

![site glyph](/i/missing-image-iso.svg)

html figure, the way published posts already do it:

<figure>
<img src="/i/missing-image-iso.svg" alt="isoline map glyph" width="320" height="160">
<figcaption>an isoline glyph sitting in the post well</figcaption>
</figure>

a dead remote image, so the missing-image well can speak:

<img src="/i/not-a-real-picture.png" alt="a picture that is not here" width="640" height="200">

## disclosure

<details markdown="1">
<summary>open for a nested note</summary>

still on the same paper. a [link](https://blog.atr0p.dev), `code`, and a second paragraph.

another line so the open state has some height.

</details>

## definition list

kramdown
: the markdown engine this site uses.

rouge
: the highlighter that paints the fences.

d3
: opt-in charts, only when the post asks.

## chart

{% include d3-figure.html id="demo-bars" caption="a tiny bar chart on the same paper" height="220" %}

<script>
(function () {
  var root = document.getElementById('demo-bars');
  if (!root || !window.d3 || !window.postD3) return;

  var data = [
    { label: 'ink', value: 4, fill: 'ink' },
    { label: 'muted', value: 2, fill: 'muted' },
    { label: 'accent', value: 5, fill: 'accent' },
    { label: 'ok', value: 3, fill: 'ok' }
  ];

  function draw() {
    var colors = postD3.colors();
    var fills = {
      ink: colors.ink,
      muted: colors.muted,
      accent: colors.accent,
      ok: colors.ok
    };
    var width = postD3.width(root) || 320;
    var height = 220;
    var margin = { top: 16, right: 16, bottom: 36, left: 16 };
    var innerW = Math.max(width - margin.left - margin.right, 0);
    var innerH = height - margin.top - margin.bottom;

    root.replaceChildren();

    var svg = d3.select(root)
      .append('svg')
      .attr('viewBox', '0 0 ' + width + ' ' + height)
      .attr('role', 'presentation');

    var g = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var x = d3.scaleBand()
      .domain(data.map(function (d) { return d.label; }))
      .range([0, innerW])
      .padding(0.28);

    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function (d) { return d.value; })])
      .range([innerH, 0]);

    g.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', function (d) { return x(d.label); })
      .attr('y', function (d) { return y(d.value); })
      .attr('width', x.bandwidth())
      .attr('height', function (d) { return innerH - y(d.value); })
      .attr('rx', 2)
      .attr('fill', function (d) { return fills[d.fill]; });

    g.selectAll('text')
      .data(data)
      .join('text')
      .attr('x', function (d) { return x(d.label) + x.bandwidth() / 2; })
      .attr('y', innerH + 18)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.muted)
      .style('font-size', '12px')
      .style('font-style', 'italic')
      .text(function (d) { return d.label; });
  }

  postD3.onTheme(draw);
  window.addEventListener('resize', draw);
})();
</script>

## emoji

unicode in a sentence: a ☕ on the 18px / 28px line, next to **bold** and `code`, plus a [link 🐫](https://blog.atr0p.dev). flags 🇹🇷 🇬🇧 and a family 👨‍👩‍👧 for fallback.

### emoji in a heading
{:.no_toc}

in a list:

* ⭐ starred
* 🚧 wip
* 🗺️ geo, beside the site's own ☉

in a table:

| mark | meaning |
| --- | --- |
| ☕ | coffee |
| 🚧 | wip |
| :+1: | shortcode, if jemoji is on |

shortcodes:

:+1: :sparkles: :camel: :tada: :rocket: :metal: :octocat:

## html odds

<!-- a comment that should not render -->

<p>a raw html paragraph with <em>emphasis</em> inside.</p>

<pre>a raw pre block
with two lines
and no language chip.</pre>

[^1]: footnotes collect at the bottom. this one points back to the inline mark.
