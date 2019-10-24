import { useContext } from 'react'
import { PreviewImageDataContext } from '../context/preview-image-data'

export const usePreviewImages = () => {
  return useContext(PreviewImageDataContext)
}
