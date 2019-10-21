import { Shape } from '../models/Shapes'
import { PreviewImageData } from '../models'
import { ImageUtil } from './image-utils'

/**
 * helper method to apply shape rotations
 * @param shapes the shape(s) to rotate
 * @param degree the rotation angle in degrees
 * @param pages the page info
 */
export const applyShapeRotations = <T extends Shape>(shapes: T[], degree: number, page: PreviewImageData) => [
  ...shapes.map(s => {
    const angle = (Math.PI / 180) * ImageUtil.normalizeDegrees(degree)
    const [sin, cos] = [Math.sin(angle), Math.cos(angle)]
    const oldX = s.x - page.Height / 2
    const oldY = s.y - page.Width / 2
    const newX = oldX * cos - oldY * sin
    const newY = oldY * cos + oldX * sin
    return {
      ...s,
      x: newX + page.Height / 2,
      y: newY + page.Width / 2,
    }
  }),
]
