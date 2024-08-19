#!/usr/bin/env node
import { saveAddressesAndPoints, saveFloorLayerNames } from './lib/inkscape'
//import { handleAddrresses } from './lib/inkscape/addresses-addresses'
import { handleResolvedAddrresses } from './lib/inkscape/addresses-resolved_addresses'
import { handleAssets } from './lib/inkscape/assets'
import { handleFacilities } from './lib/inkscape/facilities'
import { handleFloorLayers } from './lib/inkscape/layers'
import { handleMarkers } from './lib/inkscape/markers'
import { handleViewBox } from './lib/inkscape/viewbox'
import * as fs from 'fs'
import { Root } from 'xast'
import { fromXml } from 'xast-util-from-xml'

const handleInkscapeSvg = (ast: Root, dir: string) => {
  saveAddressesAndPoints(ast)
  saveFloorLayerNames(ast)

  handleViewBox(ast, dir)
  // XXX can't calc `w` (== width of bounding box)
  // XXX see address_tree.py:_post_collect_addresses
  // XXX handleAddrresses(ast, dir)
  handleResolvedAddrresses(ast, dir)
  handleAssets(ast, dir)
  handleMarkers(ast, dir)
  handleFacilities(ast, dir)
  handleFloorLayers(ast, dir)
}

const main = async (args: string[]) => {
  if (args.length < 1) {
    throw new Error()
  }
  const infile = args[0]
  const outdir = args.length === 2 ? args[1] : '.'
  const svg = await fs.readFileSync(infile)
  const ast = fromXml(svg)
  handleInkscapeSvg(ast, outdir)
}

main(process.argv.slice(2))
