import React from 'react'
import { Paper, Typography } from '@material-ui/core'
import { useLocalization } from '../../hooks'
import { Widget } from '../../services/PersonalSettings'

export const ErrorWidget: React.FunctionComponent<Widget<any>> = (widget) => {
  const localization = useLocalization().dashboard
  const inheritedClasses = widget.classes

  return (
    <div className={inheritedClasses.root}>
      <Typography color="error" variant="h2" gutterBottom={true} className={inheritedClasses.title}>
        {localization.errorLoadingWidget}
      </Typography>
      <Paper className={inheritedClasses.container} elevation={0}>
        {JSON.stringify(widget)}
      </Paper>
    </div>
  )
}
