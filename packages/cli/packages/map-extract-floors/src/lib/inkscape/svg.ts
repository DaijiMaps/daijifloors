import { snakeToCamel } from '../utils/snake-to-camel'
import { pipe } from 'effect'
import { filter } from 'unist-util-filter'
import { convert, is } from 'unist-util-is'
import { map } from 'unist-util-map'
import { Attributes, Element, Node } from 'xast'
import { x } from 'xastscript'

const HIDDEN_GROUPS_RE =
  /(\(Background\)|\(Names\)|\(Unresolved Names\)|Shops|Facilities)/

const testRemoveHiddenNodes = convert((n: Node | Element) => {
  if (is(n, 'cdata')) {
    return false
  }
  if (is(n, 'comment')) {
    return false
  }
  if (is(n, 'instruction')) {
    return false
  }
  if (is(n, 'text')) {
    return false
  }
  if ('attributes' in n) {
    if (n.attributes['inkscape:label']?.match(HIDDEN_GROUPS_RE)) return false
  }
  if ('children' in n && n.children.length === 0 && n.name === 'g') {
    return false
  }
  return true
})

const fixupRemoveHiddenNodes = (tree: Element): Element => {
  return filter(tree, { cascade: false }, testRemoveHiddenNodes)
}

const fixupId = (a: Attributes) => {
  if (a['id']?.match(/^[a-z]/)) {
    delete a['id']
  }
  return a
}

const fixupHref = (a: Attributes) => {
  const xlinkHref = a['xlink:href']
  if (xlinkHref) {
    delete a['xlink:href']
    a['href'] = xlinkHref
    return a
  }
  return a
}

const conv = (a: Attributes) => {
  const patterns = [/^style$/, /^inkscape:.*$/, /^sodipodi:.*$/]
  for (const [k] of Object.entries(a)) {
    for (const p of patterns) {
      if (k.match(p)) {
        delete a[k]
      }
    }
  }
  return a
}

const fixupSnake = (a: Attributes) => {
  for (const [k, v] of Object.entries(a)) {
    if (k.match(/-/)) {
      const kk = snakeToCamel(k)
      delete a[k]
      a[kk] = v
    }
  }
  return a
}

const fixupAttributes = (tree: Element) => {
  return map(tree, (x) => {
    if (is(x, 'element')) {
      return {
        ...x,
        attributes: pipe(x.attributes, conv, fixupId, fixupHref, fixupSnake),
      }
    }
    return x
  })
}

export const groupElements = (elems: Element[]) => x('g', {}, elems)

export const fixupElements = (tree: Element) =>
  // XXX call fixupRemoveHiddenNodes twise
  pipe(tree, fixupRemoveHiddenNodes, fixupRemoveHiddenNodes, fixupAttributes)
