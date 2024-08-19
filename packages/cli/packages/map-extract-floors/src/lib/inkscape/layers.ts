import { allLayerNames } from '../inkscape'
import { handleFloorAddresses } from './floors-addresses'
import { handleFloors } from './floors-floors'
import { handleFloorNames } from './floors-names'
import { handleFloorRenderers } from './floors-renderers'
import { is } from 'unist-util-is'
import { visitParents } from 'unist-util-visit-parents'
import { Element, Root } from 'xast'

export interface Layer {
  name: string
  element: Element
}

const saveFloorLayers = (ast: Root, layerNames: string[]) => {
  const layers: Layer[] = []
  layerNames.forEach((layerName) => {
    const trees: Layer[] = []
    visitParents<Root, undefined>(ast, (n) => {
      if (is(n, 'element')) {
        if (n.attributes['inkscape:label'] === layerName) {
          trees.push({ name: layerName, element: n })
        }
      }
    })
    if (trees.length !== 1) {
      return
    }
    const layer = trees[0]
    layer.element.children.forEach((child) => {
      if (is(child, 'element')) {
        if (child.attributes['inkscape:label'] === 'Content') {
          // save the 'Content' group, not the layer group for rendering
          layers.push({ name: layer.name, element: child })
        }
      }
    })
  })
  return layers
}

export const handleFloorLayers = (ast: Root, dir: string) => {
  const layers = saveFloorLayers(ast, allLayerNames)

  handleFloorNames(layers, dir)
  handleFloorAddresses(layers, dir)
  handleFloors(layers, dir)
  handleFloorRenderers(layers, dir)
}
