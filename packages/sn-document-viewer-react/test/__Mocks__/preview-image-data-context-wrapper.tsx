import React from 'react'
import { PreviewImageData } from '@sensenet/client-core'
import { PreviewImageDataContext } from '../../src/context/preview-image-data'
import { examplePreviewImageData } from './viewercontext'

type Props = {
  imageData: PreviewImageData[]
  rotateImages: (indexes: number[], amount: number) => void
  children: React.ReactNode
}

export const PreviewImageDataContextWrapper = (props: Props) => {
  return <PreviewImageDataContext.Provider value={{ ...props }}>{props.children}</PreviewImageDataContext.Provider>
}

PreviewImageDataContextWrapper.defaultProps = { imageData: [examplePreviewImageData], rotateImages: () => {} }
