import { PreviewImageData, Shape } from '@sensenet/client-core'

/**
 * helper method to apply shape rotations
 * @param shapes the shape(s) to rotate
 * @param degree the rotation angle in degrees
 * @param pages the page info
 */
export const applyShapeRotations = <T extends Shape>(shapes: T[], degree: number, page: PreviewImageData) => [
  ...shapes.map((shape) => {
    const origShape = shape
    switch (degree) {
      case 90:
        return {
          ...origShape,
          x: page.Height - (origShape.y + origShape.h),
          y: origShape.x,
          h: origShape.w,
          w: origShape.h,
        }
      case 180:
        return {
          ...origShape,
          x: page.Width - (origShape.x + origShape.w),
          y: page.Height - (origShape.y + origShape.h),
        }
      case 270:
        return {
          ...origShape,
          x: origShape.y,
          y: page.Width - (origShape.x + origShape.w),
          h: origShape.w,
          w: origShape.h,
        }
      default:
        return {
          ...origShape,
        }
    }
  }),
]
