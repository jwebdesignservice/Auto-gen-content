// Split an element's text into word and character spans, preserving nested
// elements (like the <em> accent) and whitespace so wrapping stays natural.
// Returns the NodeList of .char spans for animating letter by letter.
export function splitText(el) {
  const walk = (node) => {
    const kids = Array.from(node.childNodes)
    kids.forEach((child) => {
      if (child.nodeType === 3) {
        // text node -> split into words, words into chars
        const frag = document.createDocumentFragment()
        const parts = child.textContent.split(/(\s+)/)
        parts.forEach((part) => {
          if (part.length === 0) return
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part))
            return
          }
          const word = document.createElement('span')
          word.className = 'word'
          for (const ch of part) {
            const c = document.createElement('span')
            c.className = 'char'
            c.textContent = ch
            word.appendChild(c)
          }
          frag.appendChild(word)
        })
        node.replaceChild(frag, child)
      } else if (child.nodeType === 1) {
        walk(child)
      }
    })
  }
  walk(el)
  return el.querySelectorAll('.char')
}
