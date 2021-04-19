import { createStyles, IconButton, makeStyles } from '@material-ui/core'
import { RotateLeft, RotateRight } from '@material-ui/icons'
import React from 'react'
import { useLocalization } from '../../hooks'
import { ROTATION_MODE } from '../../models/rotation-model'
import { RotateWidget } from './rotate-widget'

const useStyles = makeStyles(() => {
  return createStyles({
    iconButton: { display: 'inline-block' },
    icon: {
      border: '2px solid',
      borderRadius: '5px',
    },
  })
})

type RotateDocumentClassKey = Partial<ReturnType<typeof useStyles>>

export interface RotateDocumentWidgetProps {
  mode?: ROTATION_MODE
  classes?: RotateDocumentClassKey
}

/**
 * Component that allows document rotation
 */
export const RotateDocumentWidget: React.FC<RotateDocumentWidgetProps> = (props) => {
  const localization = useLocalization()
  const classes = useStyles(props)

  const button = (direction: ROTATION_MODE, rotateDocument: (mode: string) => void) => {
    const isLeft = direction === ROTATION_MODE.anticlockwise
    return (
      <IconButton
        className={classes.iconButton}
        title={isLeft ? localization.rotateDocumentLeft : localization.rotateDocumentRight}
        onClick={isLeft ? () => rotateDocument('left') : () => rotateDocument('right')}
        id={isLeft ? 'RotateLeft' : 'RotateRight'}>
        {isLeft ? <RotateLeft className={classes.icon} /> : <RotateRight className={classes.icon} />}
      </IconButton>
    )
  }

  return <RotateWidget renderButton={button} mode={props.mode} pages="all" />
}
