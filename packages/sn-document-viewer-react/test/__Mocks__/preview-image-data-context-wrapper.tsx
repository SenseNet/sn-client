import { PreviewImageData } from '@sensenet/client-core'
import React from 'react'
import { PreviewImageDataContext } from '../../src/context/preview-image-data'
import { examplePreviewImageData } from './viewercontext'

type Props = {
  imageData: PreviewImageData[]
  children: React.ReactNode
}

export const PreviewImageDataContextWrapper = (props: Props) => {
  return <PreviewImageDataContext.Provider value={{ ...props }}>{props.children}</PreviewImageDataContext.Provider>
}

PreviewImageDataContextWrapper.defaultProps = { imageData: [examplePreviewImageData] }
