import { Box, Typography } from '@material-ui/core'
import React from 'react'

interface TabPanelProps {
  value: number
  index: number
}

export const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`api-keys-tabpanel-${index}`}
      aria-labelledby={`api-keys-tab-${index}`}
      {...other}>
      {value === index && (
        <Box p={3}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  )
}
