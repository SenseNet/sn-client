/**
 * @module ViewControls
 */
import { useRepository } from '@sensenet/hooks-react'
import React, { ReactElement } from 'react'

export interface ImageViewProps {
  renderIcon?: (name: string) => ReactElement
  handleCancel?: () => void
  contentPath: string
}

export const ImageView: React.FC<ImageViewProps> = (props) => {
  const { contentPath } = props
  const repository = useRepository()

  return <img src={`${repository.configuration.repositoryUrl}${contentPath}`} alt="" />
}
