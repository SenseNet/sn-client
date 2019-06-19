import React from 'react'
import { Typography } from '@material-ui/core'
import { QueryWidget as QueryWidgetModel } from '../../services/PersonalSettings'

export const QueryWidget: React.FunctionComponent<QueryWidgetModel> = props => {
  return (
    <div style={{ minHeight: 250 }}>
      <Typography variant="h5">{props.title}</Typography>
      {props.settings.term}
    </div>
  )
}
