/** Dimensions model that defines a specified width and height */
export interface Dimensions {
  width: number
  height: number
}
/**
 * Default scale value per step. Adjust this to increase / decrease fit relative zoom per clicks
 */
export const zoomLevelScale = 0.05
/**
 * Helper class for image manipulation
 */
export class ImageUtil {
  /**
   * Helper method that normalizes the given angle and returns a value between 0-349 in degrees
   * @param degrees the degrees
   * @returns the normalized value in degrees
   */
  public static normalizeDegrees(degrees: number): number {
    let normalizedDegrees = (degrees || 0) % 360
    if (normalizedDegrees < 0) {
      normalizedDegrees += 360
    }
    return normalizedDegrees
  }

  /**
   * Helper method that calculates a resized image size
   * @param viewPort The viewport dimensions
   * @param image The image dimensions and the rotation amount
   * @param relativeZoomLevel The relative zoom level if provided
   * @returns The relative image size
   */
  public static getImageSize(
    viewPort: Dimensions,
    image: Dimensions & { rotation: number },
    zoomLevel = 0,
  ): Dimensions {
    const boundingBox = this.getRotatedBoundingBoxSize(image, image.rotation)
    const [width, height] = [boundingBox.width, boundingBox.height]

    const zoomWidth = viewPort.width || width ? viewPort.width / width : 0
    const zoomHeight = viewPort.height || height ? viewPort.height / height : 0

    const zoom = Math.min(zoomWidth, zoomHeight)
    return {
      width: width * zoom + zoomLevel * width * zoom * zoomLevelScale,
      height: height * zoom + zoomLevel * height * zoom * zoomLevelScale,
    }
  }

  /**
   * Helper method that calculates a bounding box for a rotated image
   * @param image The image dimensions
   * @param degrees The rotation in degrees
   * @returns the calculated dimensions and the zoom ratio
   */
  public static getRotatedBoundingBoxSize(image: Dimensions, degrees: number): Dimensions & { zoomRatio: number } {
    if (ImageUtil.normalizeDegrees(degrees) === 0) {
      return {
        ...image,
        zoomRatio: 1,
      }
    }

    degrees = this.normalizeDegrees(degrees)

    if (degrees <= 90 || (degrees >= 180 && degrees <= 270)) {
      const angle1 = ((degrees % 180) * Math.PI) / 180
      const dimensions = {
        width: Math.cos(angle1) * image.width + Math.sin(angle1) * image.height,
        height: Math.sin(angle1) * image.width + Math.cos(angle1) * image.height,
      }
      return {
        ...dimensions,
        zoomRatio: image.width / dimensions.width,
      }
    } else {
      const h = image.width
      const w = image.height
      const angle2 = (((degrees % 180) - 90) * Math.PI) / 180
      const dimensions = {
        width: Math.cos(angle2) * w + Math.sin(angle2) * h,
        height: Math.sin(angle2) * w + Math.cos(angle2) * h,
      }
      return {
        ...dimensions,
        zoomRatio: image.height / dimensions.width,
      }
    }
  }
}
