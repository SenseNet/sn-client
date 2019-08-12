import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { createStyles, Theme } from '@material-ui/core'
import { Icon, iconType } from '@sensenet/icons-react'
import Button, { ButtonProps } from '@material-ui/core/Button'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    oAuthButton: {
      borderRadius: 0,
    },
    leftIcon: {
      marginRight: theme.spacing(1),
    },
  }),
)

interface Props {
  iconName: string
  buttonText?: string
  buttonProps?: ButtonProps
}

export const OAuthButton = (props: Props) => {
  const classes = useStyles()
  return (
    <Button {...props.buttonProps} variant="outlined" color="default" className={classes.oAuthButton}>
      <Icon
        type={iconType.fontawesome}
        color="inherit"
        iconName={props.iconName}
        classes={{ root: classes.leftIcon }}
      />
      {props.buttonText}
    </Button>
  )
}
