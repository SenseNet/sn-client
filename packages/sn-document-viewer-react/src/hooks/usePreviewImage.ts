import { useCallback } from 'react'
import { usePreviewImages } from './usePreviewImages'

export const usePreviewImage = (pageNo: number) => {
  const images = usePreviewImages()

  // ToDo: Poll preview available ?

  const image = images.imageData.find(i => i.Index === pageNo)
  const { imageData, ...context } = { ...images }

  const rotate = useCallback((amount: number) => images.rotateImages([pageNo], amount), [images, pageNo])

  return {
    ...context,
    image,
    rotate,
  }
}
