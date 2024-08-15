import { Floor, FloorProps } from './Floor'
import { withFading } from './WithFading'

export const FadingFloor = withFading<FloorProps>(Floor)
