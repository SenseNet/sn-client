import IconButton from '@material-ui/core/IconButton/IconButton'
import createStyles from '@material-ui/core/styles/createStyles'
import makeStyles from '@material-ui/core/styles/makeStyles'
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
  isVisible: boolean

  /**
   * The title property of the button
   */
  title: string

  /**
   * Function to set the isVisible's value
   */
  setValue: (isVisible: boolean) => void

  /**
   * Flag to store if the user has the required permisison for the action
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
      color={props.isVisible ? 'primary' : 'inherit'}
      title={props.title}
      onClick={() => props.setValue(!props.isVisible)}>
      {props.children}
    </IconButton>
  )
}
