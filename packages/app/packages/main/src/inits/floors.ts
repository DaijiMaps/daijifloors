import { assets } from '../../data/assets'
import info from '../../data/floors.json'
import { FloorNames } from '../../data/floors/names'
import { renderers } from '../../data/floors/renderers'
import { markers } from '../../data/markers'
import viewBox from '../../data/viewBox.json'
import { installFloorsOps } from '@daijimaps/daijifloors-app-lib'

export function initFloors() {
  installFloorsOps({
    idx: info.idx,
    names: FloorNames,
    floors: info.floors,
    viewBox: `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`,
    assets,
    markers,
    renderers,
  })
}
