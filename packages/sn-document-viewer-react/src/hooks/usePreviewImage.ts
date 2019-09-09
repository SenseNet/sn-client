import { useContext } from 'react'
import { PreviewImageDataContext } from '../context/preview-image-data'

export const usePreviewImage = (pageNo: number) => {
  const images = useContext(PreviewImageDataContext)

  // ToDo: Poll preview available ?

  return images.find(i => i.Index === pageNo)
}
