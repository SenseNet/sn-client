import { formatSize } from '@sensenet/controls-react'
import { createStyles, ListItemText, makeStyles, MenuItem, Paper, Select } from '@material-ui/core'
import React, { useState } from 'react'
import ReactFrappeChart from 'react-frappe-charts'
import { widgetStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { useDateUtils } from '../../hooks/use-date-utils'

const exampleStatsUsageData = {
  UsageData: [
    {
      PeriodStartDate: '2021-01-01T00:00:00Z',
      PeriodEndDate: '2021-02-01T00:00:00Z',
      UsageValues: [
        215, 220, 230, 215, 258, 112, 17, 37, 12, 23, 233, 233, 232, 234, 43, 23, 32, 65, 1, 0, 1, 22, 91, 24, 25, 6, 3,
        80, 2, 2, 3,
      ],
      ApiCalls: 2,
      UsagePerMonth: 230085376, //byte
    },
    {
      PeriodStartDate: '2021-02-01T00:00:00Z',
      PeriodEndDate: '2021-03-01T00:00:00Z',
      UsageValues: [
        234, 43, 23, 32, 65, 1, 0, 1, 22, 91, 24, 25, 6, 3, 80, 2, 2, 3, 215, 220, 230, 215, 258, 112, 17, 37, 12, 23,
        233, 233,
      ],
      ApiCalls: 6,
      UsagePerMonth: 220085376, //byte
    },
    {
      PeriodStartDate: '2021-03-01T00:00:00Z',
      PeriodEndDate: '2021-04-01T00:00:00Z',
      UsageValues: [
        234, 143, 123, 132, 165, 111, 110, 11, 122, 91, 24, 25, 6, 3, 80, 2, 2, 3, 215, 220, 230, 215, 258, 112, 17, 37,
        12, 23, 233, 233,
      ],
      ApiCalls: 5,
      UsagePerMonth: 50232435, //byte
    },
    {
      PeriodStartDate: '2021-04-01T00:00:00Z',
      PeriodEndDate: '2021-05-01T00:00:00Z',
      UsageValues: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 91, 24, 25, 6, 3, 80, 2, 2, 3, 215, 220, 230, 215, 258, 112, 17, 37, 12, 23, 233,
        233,
      ],
      ApiCalls: 1,
      UsagePerMonth: 12344544, //byte
    },
    {
      // ez egy tört hónap
      PeriodStartDate: '2021-05-01T00:00:00Z',
      PeriodEndDate: '2021-05-13T00:00:00Z',
      UsageValues: [200, 201, 202, 203, 204, 205, 206, 207, 208, 291, 324, 325, 306],
      ApiCalls: 3,
      UsagePerMonth: 250085376, //byte
    },
  ],
}

const useWidgetStyles = makeStyles(widgetStyles)

const useStyles = makeStyles(() => {
  return createStyles({
    rowContainer: {
      padding: '16px 0',
    },
    usageContainer: {
      display: 'flex',
      flexFlow: 'row',
    },
    leftContent: {
      width: '60%',
      backgroundColor: '#252525',
    },
    rightContent: {
      width: '40%',
      paddingLeft: '40px',
    },
  })
})
export const UsageWidget: React.FunctionComponent = () => {
  const classes = useStyles()
  const widgetClasses = useWidgetStyles()
  const localization = useLocalization().settings
  const dateUtils = useDateUtils()
  const [currentData, setCurrentData] = useState(
    exampleStatsUsageData.UsageData[exampleStatsUsageData.UsageData.length - 1],
  )

  return (
    <div className={widgetClasses.root}>
      <Paper elevation={0} className={widgetClasses.container}>
        <div className={classes.rowContainer} style={{ fontSize: '16px' }}>
          <span>{localization.usage}</span>
        </div>
        <div className={classes.usageContainer}>
          <div className={classes.leftContent}>
            <ReactFrappeChart
              type="line"
              colors={['#26a69a']}
              axisOptions={{ xAxisMode: 'span', yAxisMode: 'span', xIsSeries: 1 }}
              height={400}
              lineOptions={{ hideDots: 1 }}
              barOptions={{ spaceRatio: 10 }}
              data={{
                labels: Array(currentData.UsageValues.length).fill(''),
                datasets: [{ values: currentData.UsageValues }],
              }}
            />
          </div>
          <div className={classes.rightContent}>
            <Select
              value={currentData.PeriodStartDate}
              onChange={(event) => {
                setCurrentData(
                  exampleStatsUsageData.UsageData.find(
                    (usageItem) => event.target.value === usageItem.PeriodStartDate,
                  ) || exampleStatsUsageData.UsageData[exampleStatsUsageData.UsageData.length - 1],
                )
              }}>
              {exampleStatsUsageData.UsageData.map((item, key) => {
                return (
                  <MenuItem key={key} value={item.PeriodStartDate}>
                    <ListItemText>
                      {dateUtils.formatDate(dateUtils.parseDate(item.PeriodStartDate as any), 'LLL dd yyyy')} -{' '}
                      {dateUtils.formatDate(dateUtils.parseDate(item.PeriodEndDate as any), 'LLL dd yyyy')}
                    </ListItemText>
                  </MenuItem>
                )
              })}
            </Select>
            <div className={classes.rowContainer}>{localization.usageOfThisRepo}</div>
            <div style={{ fontSize: '30px' }}>{formatSize(currentData.UsagePerMonth)}</div>
            <div className={classes.rowContainer}>{localization.apiCalls}</div>
            <div style={{ fontSize: '30px' }}>{currentData.ApiCalls}</div>
          </div>
        </div>
      </Paper>
    </div>
  )
}
