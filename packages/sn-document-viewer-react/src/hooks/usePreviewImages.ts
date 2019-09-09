import { useContext } from 'react'
import { PreviewImageDataContext } from '../context/preview-image-data'

export const usePreviewImages = () => {
  const images = useContext(PreviewImageDataContext)
  return images
}
