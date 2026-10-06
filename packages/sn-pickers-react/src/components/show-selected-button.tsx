import { Box, Link } from '@material-ui/core'
import React from 'react'
import { useSelection } from '../hooks/use-selection'

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
    <>
      {/* @ts-ignore*/}
      <Box className={className} data-test="show-selected-container">
        <Link component="button" variant="body2" onClick={handleClick}>
          {localization.label} ({selection.length})
        </Link>
      </Box>
    </>
  )
}
