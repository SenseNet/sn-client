import { PreviewImageData } from '@sensenet/client-core'
import { Dimensions } from '..'

/**
 * The amount of rotation in degrees
 */
export const ROTATION_AMOUNT = 90

/**
 * Visibility of the rotation related buttons
 */
export enum ROTATION_MODE {
  clockwise,
  anticlockwise,
  all,
}

/**
 * Defined the component's own properties
 */
export interface RotatePageProps {
  page: PreviewImageData
  viewPort: Dimensions
  zoomRatio: number
}
