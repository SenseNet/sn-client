/**
 * @module ViewControls
 */
import { Style } from '@material-ui/icons'
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

  return (
    <div style={{ overflow: 'auto', margin: '15px 24px' }}>
      <img src={`${repository.configuration.repositoryUrl}${contentPath}`} alt="" />
    </div>
  )
}
