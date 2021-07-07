import { createStyles, IconButton, makeStyles } from '@material-ui/core'
import { RotateLeft, RotateRight } from '@material-ui/icons'
import React from 'react'
import { useLocalization } from '../../hooks'
import { ROTATION_MODE } from '../../models/rotation-model'
import { RotateWidget } from './rotate-widget'

const useStyles = makeStyles(() => {
  return createStyles({
    iconButton: {},
    icon: {},
  })
})

type RotateActivePagesClassKey = Partial<ReturnType<typeof useStyles>>

export interface RotateActivePagesWidgetProps {
  mode?: ROTATION_MODE
  classes?: RotateActivePagesClassKey
}

export const RotateActivePagesWidget: React.FC<RotateActivePagesWidgetProps> = (props) => {
  const localization = useLocalization()
  const classes = useStyles(props)

  const button = (direction: ROTATION_MODE, rotateDocument: (mode: string) => void) => {
    const isLeft = direction === ROTATION_MODE.anticlockwise
    return (
      <IconButton
        className={classes.iconButton}
        color="inherit"
        title={isLeft ? localization.rotatePageLeft : localization.rotatePageRight}
        onClick={() => (isLeft ? rotateDocument('left') : rotateDocument('right'))}>
        {isLeft ? <RotateLeft className={classes.icon} /> : <RotateRight className={classes.icon} />}
      </IconButton>
    )
  }

  return <RotateWidget renderButton={button} mode={props.mode} pages="active" />
}
