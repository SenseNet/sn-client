import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { Bullie } from '../Bullie'

export interface DashboardProps {
  title: string
  settings: any
}

const Dashboard: React.FunctionComponent<DashboardProps> = ({ title }) => (
  <Paper style={{ padding: '1em', margin: '1em', overflow: 'auto' }}>
    <Typography variant="h3">{title}</Typography>
    <Bullie />
  </Paper>
)

export default Dashboard
