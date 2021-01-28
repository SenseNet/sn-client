import { createStyles, makeStyles, Paper } from '@material-ui/core'
import React from 'react'
import { useWidgetStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'

const useStyles = makeStyles(() => {
  return createStyles({
    rowContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0',
    },
  })
})

export const UsageWidget: React.FunctionComponent = () => {
  const classes = useStyles()
  const widgetClasses = useWidgetStyles()
  const localization = useLocalization().settings

  return (
    <div className={widgetClasses.root}>
      <Paper elevation={0} className={widgetClasses.container}>
        <div className={classes.rowContainer}>
          <span>{localization.usage}</span>
        </div>
      </Paper>
    </div>
  )
}
