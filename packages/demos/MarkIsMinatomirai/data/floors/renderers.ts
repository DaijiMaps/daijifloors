import { Floor1F } from './floor_1F'
import { Floor2F } from './floor_2F'
import { Floor3F } from './floor_3F'
import { Floor4F } from './floor_4F'
import { Floor5F } from './floor_5F'
import { FloorB1 } from './floor_B1'
import { FloorB2 } from './floor_B2'
import { FloorB4 } from './floor_B4'
import { FloorGL } from './floor_GL'

export const renderers = {
  B4: FloorB4,
  B2: FloorB2,
  B1: FloorB1,
  GL: FloorGL,
  '1F': Floor1F,
  '2F': Floor2F,
  '3F': Floor3F,
  '4F': Floor4F,
  '5F': Floor5F,
}
