import React from 'react'
import { Typography } from '@material-ui/core'
import { useLocalization } from '../../hooks'
import { Widget } from '../../services/PersonalSettings'

export const ErrorWidget: React.FunctionComponent<Widget<any>> = (widget) => {
  const localization = useLocalization().dashboard
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Typography color="error" variant="h5" gutterBottom={true}>
        {localization.errorLoadingWidget}
      </Typography>
      {JSON.stringify(widget)}
    </div>
  )
}
