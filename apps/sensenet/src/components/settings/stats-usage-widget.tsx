import { createStyles, makeStyles, Paper } from '@material-ui/core'
import React from 'react'
import ReactFrappeChart from 'react-frappe-charts'
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
        <ReactFrappeChart
          type="line"
          colors={['#26a69a']}
          axisOptions={{ xAxisMode: 'tick', yAxisMode: 'tick', xIsSeries: 1 }}
          height={300}
          data={{
            labels: ['', '', '', '', '', '', '', ''],
            datasets: [{ values: [15, 20, -3, -15, 58, 12, -17, 37] }],
          }}
        />
      </Paper>
    </div>
  )
}
