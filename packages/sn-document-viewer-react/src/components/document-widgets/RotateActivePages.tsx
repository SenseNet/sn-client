import IconButton from '@material-ui/core/IconButton'
import RotateLeft from '@material-ui/icons/RotateLeft'
import RotateRight from '@material-ui/icons/RotateRight'
import React from 'react'
import { useLocalization } from '../../hooks'
import { ROTATION_MODE } from '../../models/RotationModel'
import { RotateWidget } from './RotateWidget'

export interface RotateActivePagesWidgetProps {
  mode?: ROTATION_MODE
}

export const RotateActivePagesWidget: React.FC<RotateActivePagesWidgetProps> = (props) => {
  const localization = useLocalization()

  const button = (direction: ROTATION_MODE, rotateDocument: (mode: string) => void) => {
    const isLeft = direction === ROTATION_MODE.anticlockwise
    return (
      <IconButton
        color="inherit"
        title={isLeft ? localization.rotatePageLeft : localization.rotatePageRight}
        onClick={() => (isLeft ? rotateDocument('left') : rotateDocument('right'))}>
        {isLeft ? <RotateLeft /> : <RotateRight />}
      </IconButton>
    )
  }

  return <RotateWidget renderButton={button} mode={props.mode} pages="active" />
}
