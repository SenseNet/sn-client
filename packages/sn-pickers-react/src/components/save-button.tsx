import Button, { ButtonProps } from '@material-ui/core/Button'
import React from 'react'
import { useSelection } from '../hooks'

interface SaveButtonProps extends ButtonProps {
  localization: {
    label: string
  }
}

export const SaveButton: React.FC<SaveButtonProps> = ({ localization, ...props }) => {
  const { selection } = useSelection()

  return (
    <Button
      aria-label={localization.label}
      color="primary"
      variant="contained"
      autoFocus={true}
      disabled={props.disabled || false}
      {...props}>
      {localization.label} ({selection.length})
    </Button>
  )
}
