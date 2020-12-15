import { createStyles, makeStyles } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton/IconButton'
import React from 'react'

const useStyles = makeStyles(() => {
  return createStyles({
    iconButton: {},
    iconActive: {},
    icon: {},
  })
})

type ToggleBaseClassKey = Partial<ReturnType<typeof useStyles>>

/**
 * Properties for Toggle Base component
 */
export interface ToggleBaseProps {
  /**
   * Determines if the button is toggled
   */
  isVisible: boolean

  /**
   * The title property of the button
   */
  title: string

  /**
   * Function to set the isVisible's value
   */
  setValue: (isVisible: boolean) => void
}

/**
 * Represents a base toggle component
 */
export const ToggleBase: React.FunctionComponent<ToggleBaseProps & { classes?: ToggleBaseClassKey }> = (props) => {
  const classes = useStyles(props)
  return (
    <div style={{ display: 'inline-block' }}>
      <IconButton
        className={classes.iconButton}
        color={props.isVisible ? 'primary' : 'inherit'}
        title={props.title}
        onClick={() => props.setValue(!props.isVisible)}>
        {props.children}
      </IconButton>
    </div>
  )
}
