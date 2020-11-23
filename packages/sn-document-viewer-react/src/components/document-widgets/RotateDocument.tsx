import IconButton from '@material-ui/core/IconButton'
import RotateLeft from '@material-ui/icons/RotateLeft'
import RotateRight from '@material-ui/icons/RotateRight'
import React from 'react'
import { useLocalization } from '../../hooks'
import { ROTATION_MODE } from '../../models/RotationModel'
import { RotateWidget } from './RotateWidget'
/**
 * Component that allows document rotation
 */
export const RotateDocumentWidget: React.FC<{ mode?: ROTATION_MODE }> = (props) => {
  const localization = useLocalization()

  const button = (direction: ROTATION_MODE, rotateDocument: (mode: string) => void) => {
    const isLeft = direction === ROTATION_MODE.anticlockwise
    return (
      <IconButton
        title={isLeft ? localization.rotateDocumentLeft : localization.rotateDocumentRight}
        onClick={isLeft ? () => rotateDocument('left') : () => rotateDocument('right')}
        id={isLeft ? 'RotateLeft' : 'RotateRight'}>
        {isLeft ? (
          <RotateLeft style={{ border: '2px solid', borderRadius: '5px' }} />
        ) : (
          <RotateRight style={{ border: '2px solid', borderRadius: '5px' }} />
        )}
      </IconButton>
    )
  }

  return <RotateWidget renderButton={button} mode={props.mode} pages="all" />
}
