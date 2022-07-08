import { Button, ButtonProps } from '@material-ui/core'
import React from 'react'

interface SaveButtonProps extends ButtonProps {
  localization: {
    label: string
  }
}

export const SaveButton: React.FC<SaveButtonProps> = ({ localization, ...props }) => {
  return (
    <Button
      aria-label={localization.label}
      color="primary"
      variant="contained"
      autoFocus={true}
      disabled={props.disabled || false}
      {...props}>
      {localization.label}
    </Button>
  )
}
