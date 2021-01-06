import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import React from 'react'
import { useSelection } from '../hooks/useSelection'

interface ShowSelectedButtonProps {
  localization: {
    label: string
  }
  handleClick: () => void
  className?: string
}

export const ShowSelectedButton: React.FC<ShowSelectedButtonProps> = ({ localization, className, handleClick }) => {
  const { selection } = useSelection()

  return (
    <Box className={className}>
      <Link component="button" variant="body2" onClick={handleClick}>
        {localization.label} ({selection.length})
      </Link>
    </Box>
  )
}
