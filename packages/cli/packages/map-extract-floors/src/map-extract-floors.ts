#!/usr/bin/env node
import { generateAllBoundingBoxes, parseAllBoundingBoxes } from './lib/inkscape'
import { handleAddrresses } from './lib/inkscape/addresses-addresses'
import { saveAllAddressesAndPoints } from './lib/inkscape/addresses-addresses'
import { handleResolvedAddrresses } from './lib/inkscape/addresses-resolved_addresses'
import { handleAssets, saveAllAssets } from './lib/inkscape/assets'
import { handleFacilities } from './lib/inkscape/facilities'
import { saveAllFloorLayerNames } from './lib/inkscape/floors-floors'
import { handleFloorLayers } from './lib/inkscape/layers'
import { handleMarkers } from './lib/inkscape/markers'
import { handleViewBox } from './lib/inkscape/viewbox'
import * as fs from 'fs'
import { resolve } from 'path'
import { Root } from 'xast'
import { fromXml } from 'xast-util-from-xml'

const handleInkscapeSvg = (ast: Root, dir: string) => {
  saveAllFloorLayerNames(ast)
  saveAllAssets(ast)
  saveAllAddressesAndPoints(ast)

  handleViewBox(ast, dir)
  handleAddrresses(ast, dir)
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
  const infile = resolve(args[0])
  const outdir = resolve(args.length === 2 ? args[1] : '.')

  const bb = generateAllBoundingBoxes(infile, outdir)
  parseAllBoundingBoxes(bb)

  const svg = await fs.readFileSync(infile)
  const ast = fromXml(svg)
  handleInkscapeSvg(ast, outdir)
}

main(process.argv.slice(2))
