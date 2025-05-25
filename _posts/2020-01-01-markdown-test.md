---
category: blog
title: "markdown showdown"
published: false
starred: false
---

# This is an <h1> tag
## This is an <h2> tag
### This is an <h3> tag
#### This is an <h4> tag
##### This is an <h5> tag
###### This is an <h6> tag

*This text will be italic*
_This will also be italic_
**This text will be bold**
__This will also be bold__
*You **can** combine them*

As Grace Hopper said:
> I’ve always been more interested
> in the future than in the past.

* Item 1
* Item 2
 * Item 2a
 * Item 2b

1. Item 1
2. Item 2
3. Item 3
 * Item 3a
 * Item 3b

\*literal asterisks\*

- [x] this is a complete item
- [ ] this is an incomplete item
- [x] @mentions, #refs, [links](),
**formatting**, and <del>tags</del>
supported
- [x] list syntax required (any
unordered or ordered list
supported)

```javascript
function test() {
 console.log("look ma’, no spaces");
}
```

First Header | Second Header | Third Header
------------ | ------------- | ------------
Content cell 1 | Content cell 2 | Content cell 3
Content column 1 | Content column 2 | Content column 3
**Bold content** | *Italic content* | `Code content`
Long content that might wrap to multiple lines | Short | Medium length content

```python
def fibonacci(n):
    """Generate fibonacci sequence up to n"""
    a, b = 0, 1
    while a < n:
        print(a, end=' ')
        a, b = b, a + b
    print()

# Call the function
fibonacci(100)
```

```css
.highlight {
  background: var(--code-bg);
  border-radius: 8px;
  margin: 1em -30px;
  padding: 16px 30px 14px;
  overflow-x: auto;
}
```

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

GitHub supports emoji!
:+1: :sparkles: :camel: :tada:
:rocket: :metal: :octocat:
