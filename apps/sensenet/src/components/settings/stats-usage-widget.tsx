import { formatSize } from '@sensenet/controls-react'
import { createStyles, ListItemText, makeStyles, MenuItem, Paper, Select } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import ReactFrappeChart from 'react-frappe-charts'
import { widgetStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { useDateUtils } from '../../hooks/use-date-utils'

export type PeriodData = {
  PeriodStartDate: string
  PeriodEndDate: string
}

const getUsageData1 = () => {
  return {
    DataType: 'SampleApiCall',
    Start: '2021-06-01T00:00:00Z',
    End: '2021-07-01T00:00:00',
    TimeWindow: 'Month',
    Resolution: 'Day',
    CallCount: [
      3600, 3601, 3602, 3603, 3604, 3605, 3606, 3607, 3608, 3609, 3610, 3611, 3612, 3613, 3614, 3615, 3616, 3617, 3618,
      3619, 3620, 3621, 3622, 3623, 3624, 3625, 3626, 3627, 3628, 3629, 3630,
    ],
    RequestLengths: [
      360000, 360001, 360002, 360003, 360004, 360005, 360006, 360007, 360008, 360009, 360010, 360011, 360012, 360013,
      360014, 360015, 360016, 360017, 360018, 360019, 360020, 360021, 360022, 360023, 360024, 360025, 360026, 360027,
      360028, 360029, 360030,
    ],
    ResponseLengths: [
      340000, 340001, 340002, 340003, 340004, 340005, 340006, 340007, 340008, 340009, 340010, 340011, 340012, 340013,
      340014, 340015, 340016, 340017, 340018, 340019, 340020, 340021, 340022, 340023, 340024, 340025, 340026, 340027,
      340028, 340029, 340030,
    ],
    Status100: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    Status200: [
      2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880,
      2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880,
    ],
    Status300: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    Status400: [
      360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360,
      360, 360, 360, 360, 360, 360, 360,
    ],
    Status500: [
      360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360,
      360, 360, 360, 360, 360, 360, 360,
    ],
  }
}

const getUsageData2 = () => {
  return {
    DataType: 'SampleApiCall',
    Start: '2021-05-01T00:00:00Z',
    End: '2021-06-01T00:00:00',
    TimeWindow: 'Month',
    Resolution: 'Day',
    CallCount: [
      2600, 2601, 1602, 2602, 2604, 2605, 2606, 2607, 2608, 2609, 1610, 2611, 2612, 2612, 2614, 2615, 2616, 2617, 2618,
      2619, 2620, 2621, 2622, 2622, 2624, 2625, 2626, 2627, 2628, 1629, 2620, 2620,
    ],
    RequestLengths: [
      160000, 160001, 160002, 160001, 160004, 160005, 160006, 160007, 160008, 160009, 160010, 160011, 160012, 160011,
      160014, 160015, 160016, 160017, 160018, 160019, 160020, 160021, 160022, 160021, 160024, 160025, 160026, 160027,
      160028, 160029, 160010, 160010,
    ],
    ResponseLengths: [
      240000, 240001, 240001, 240002, 240004, 240005, 240006, 240007, 240008, 240009, 240010, 240011, 240011, 240012,
      240014, 240015, 240016, 240017, 240018, 240019, 240010, 240011, 240011, 240012, 240014, 240015, 240016, 240017,
      240018, 240019, 240020, 240020,
    ],
    Status100: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    Status200: [
      2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880,
      2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880, 2880,
    ],
    Status300: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    Status400: [
      360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360,
      360, 360, 360, 360, 360, 360, 360, 360,
    ],
    Status500: [
      360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 360,
      360, 360, 360, 360, 360, 360, 360, 360,
    ],
  }
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
  const [currentPeriod, setCurrentPeriod] = useState<PeriodData>(props.periodData[props.periodData.length - 1])
  const [currentData, setCurrentData] = useState(getUsageData1())

  const dataTraffic = currentData.RequestLengths.map((request, index) => request + currentData.ResponseLengths[index])

  useEffect(() => {
    if (
      currentPeriod.PeriodStartDate === '2021-01-01T00:00:00Z' ||
      currentPeriod.PeriodStartDate === '2021-03-01T00:00:00Z'
    ) {
      setCurrentData(getUsageData1())
    } else {
      setCurrentData(getUsageData2())
    }
  }, [currentPeriod])

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
                  props.periodData.find((usageItem) => event.target.value === usageItem.PeriodStartDate) ||
                    props.periodData[props.periodData.length - 1],
                )
              }}>
              {props.periodData.map((item, index) => {
                return (
                  <MenuItem key={index} value={item.PeriodStartDate}>
                    <ListItemText>
                      {dateUtils.formatDate(dateUtils.parseDate(item.PeriodStartDate as any), 'LLL dd yyyy')} -{' '}
                      {dateUtils.formatDate(dateUtils.parseDate(item.PeriodEndDate as any), 'LLL dd yyyy')}
                    </ListItemText>
                  </MenuItem>
                )
              })}
            </Select>
            <div className={classes.rowContainer}>{localization.dataTraffic}</div>
            <div style={{ fontSize: '30px' }}>{formatSize(dataTraffic.reduce((a, b) => a + b, 0))}</div>
            <div className={classes.rowContainer}>{localization.apiCalls}</div>
            <div style={{ fontSize: '30px' }}>{currentData.CallCount.reduce((a, b) => a + b, 0)}</div>
          </div>
        </div>
      </Paper>
    </div>
  )
}
