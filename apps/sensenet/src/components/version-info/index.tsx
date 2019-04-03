import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { Bullie } from '../Bullie'

export const VersionInfo: React.FunctionComponent = () => {
  return (
    <Paper style={{ padding: '1em', margin: '1em', overflow: 'auto' }}>
      <Typography variant="h3">Version Info</Typography>
      <Bullie />
    </Paper>
  )
}

export default VersionInfo
