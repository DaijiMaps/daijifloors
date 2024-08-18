#!/usr/bin/env node
import { handleAssets } from './lib/inkscape/assets'
import { handleFloorLayers } from './lib/inkscape/layers'
import { handleMarkers } from './lib/inkscape/markers'
import { handleResolvedAddrresses } from './lib/inkscape/resolved_addresses'
import { handleViewBox } from './lib/inkscape/viewbox'
import * as fs from 'fs'
import { Root } from 'xast'
import { fromXml } from 'xast-util-from-xml'

const handleInkscapeSvg = (ast: Root, dir: string) => {
  handleViewBox(ast, dir)
  handleResolvedAddrresses(ast, dir)
  handleAssets(ast, dir)
  handleMarkers(ast, dir)
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
