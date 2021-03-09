import { createStyles, IconButton, makeStyles } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles(() => {
  return createStyles({
    iconButton: { display: 'inline-block' },
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
  active: boolean

  /**
   * The title property of the button
   */
  title: string

  /**
   * Function to set the isVisible's value
   */
  setValue: (isVisible: boolean) => void

  /**
   * Determines if the button is disabled
   */
  disabled?: boolean

  /**
   * Styles to override
   */
  classes?: ToggleBaseClassKey
}

/**
 * Represents a base toggle component
 */
export const ToggleBase: React.FunctionComponent<ToggleBaseProps> = (props) => {
  const classes = useStyles(props)
  return (
    <IconButton
      disabled={props.disabled}
      className={classes.iconButton}
      color={props.active ? 'primary' : 'inherit'}
      title={props.title}
      onClick={() => props.setValue(!props.active)}>
      {props.children}
    </IconButton>
  )
}
