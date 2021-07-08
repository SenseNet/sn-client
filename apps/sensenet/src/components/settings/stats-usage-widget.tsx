import { formatSize } from '@sensenet/controls-react'
import { useRepository } from '@sensenet/hooks-react'
import { createStyles, ListItemText, makeStyles, MenuItem, Paper, Select } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import ReactFrappeChart from 'react-frappe-charts'
import { widgetStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { useDateUtils } from '../../hooks/use-date-utils'
import { FullScreenLoader } from '../full-screen-loader'

export type PeriodData = {
  PeriodStartDate: Date
  PeriodEndDate: Date
}

export type ApiPeriod = {
  DataType: String
  Start: String
  End: String
  TimeWindow: 'Hour' | 'Day' | 'Month' | 'Year'
  Resolution: 'Minute' | 'Hour' | 'Day' | 'Month'
  CallCount: number[]
  RequestLengths: number[]
  ResponseLengths: number[]
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

export interface UsageWidgetProps {
  periodData: PeriodData[]
}

export const UsageWidget: React.FunctionComponent<UsageWidgetProps> = (props) => {
  const classes = useStyles()
  const widgetClasses = useWidgetStyles()
  const localization = useLocalization().settings
  const dateUtils = useDateUtils()
  const repository = useRepository()
  const [currentPeriod, setCurrentPeriod] = useState<PeriodData>(props.periodData[props.periodData.length - 1])
  const [currentData, setCurrentData] = useState<ApiPeriod>()

  const dataTraffic = currentData?.RequestLengths.map((request, index) => request + currentData.ResponseLengths[index])

  useEffect(() => {
    ;(async () => {
      const response = await repository.executeAction<any, ApiPeriod>({
        idOrPath: '/Root',
        name: 'GetApiUsagePeriod',
        method: 'POST',
        body: {
          timeWindow: 'Month',
        },
      })

      setCurrentData(response)
    })()
  }, [repository])

  if (!dataTraffic) return <FullScreenLoader />
  if (!currentPeriod) return null

  return (
    <div className={widgetClasses.root}>
      <Paper elevation={0} className={widgetClasses.container}>
        <div className={classes.rowContainer} style={{ fontSize: '16px' }}>
          <span>{localization.traffic}</span>
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
                labels: Array(dataTraffic.length)
                  .fill('')
                  .map((_item, index) => (index % 5 ? '' : index.toString())),
                datasets: [{ values: dataTraffic }],
              }}
            />
          </div>
          <div className={classes.rightContent}>
            <Select
              value={currentPeriod.PeriodStartDate}
              onChange={(event) => {
                setCurrentPeriod(
                  props.periodData.find((usageItem) => event.target.value === usageItem.PeriodStartDate.toString()) ||
                    props.periodData[props.periodData.length - 1],
                )
              }}>
              {props.periodData.map((item, index) => {
                return (
                  <MenuItem key={index} value={item.PeriodStartDate.toString()}>
                    <ListItemText>
                      {dateUtils.formatDate(item.PeriodStartDate, 'LLL dd yyyy')} -{' '}
                      {dateUtils.formatDate(item.PeriodEndDate, 'LLL dd yyyy')}
                    </ListItemText>
                  </MenuItem>
                )
              })}
            </Select>
            <div className={classes.rowContainer}>{localization.dataTraffic}</div>
            <div style={{ fontSize: '30px' }}>{formatSize(dataTraffic.reduce((a, b) => a + b, 0))}</div>
            <div className={classes.rowContainer}>{localization.apiCalls}</div>
            <div style={{ fontSize: '30px' }}>{currentData?.CallCount.reduce((a, b) => a + b, 0)}</div>
          </div>
        </div>
      </Paper>
    </div>
  )
}
