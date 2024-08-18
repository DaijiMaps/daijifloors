import { layerNames } from '../inkscape'
import { handleAddresses } from './addresses'
import { handleFloors } from './floors'
import { handleNames } from './names'
import { handleRenderers } from './renderers'
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
  const layers = saveFloorLayers(ast, layerNames)

  handleNames(layers, dir)
  handleAddresses(layers, dir)
  handleFloors(layers, dir)
  handleRenderers(layers, dir)
}
