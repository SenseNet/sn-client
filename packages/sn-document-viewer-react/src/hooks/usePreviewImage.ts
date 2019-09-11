import { useCallback } from 'react'
import { usePreviewImages } from './usePreviewImages'

export const usePreviewImage = (pageNo: number) => {
  const images = usePreviewImages()
  const image = images.imageData.find(i => i.Index === pageNo)
  const { imageData, ...context } = { ...images }

  // ToDo: Polling?

  const rotate = useCallback((amount: number) => images.rotateImages([pageNo], amount), [images, pageNo])

  return {
    ...context,
    image,
    rotate,
  }
}
