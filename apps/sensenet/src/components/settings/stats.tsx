import { useRepository, VersionInfo } from '@sensenet/hooks-react'
import { Container } from '@material-ui/core'
import clsx from 'clsx'
import { addMonths, isSameDay, parseISO } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { DashboardData } from '../dashboard/types'
import { FullScreenLoader } from '../full-screen-loader'
import { ComponentsWidget } from './stats-components-widget'
import { InstalledPackagesWidget } from './stats-installed-packages-widget'
import { StorageWidget } from './stats-storage-widget'
import { UsageWidget } from './stats-usage-widget'

const makePeriodArrayFromRawData = (periodData: RawPeriodData) => {
  const periodArray = []
  const rawData = periodData

  let currentDate = parseISO(rawData.First)
  const lastDate = parseISO(rawData.Last)

  while (!isSameDay(currentDate, lastDate)) {
    const endDate = addMonths(currentDate, 1)
    periodArray.push({
      PeriodStartDate: currentDate,
      PeriodEndDate: endDate,
    })
    currentDate = endDate
  }
  if (periodArray.length < rawData.Count) {
    periodArray.push({
      PeriodStartDate: lastDate,
      PeriodEndDate: new Date(Date.now()),
    })
  }

  return periodArray
}

export type RawPeriodData = {
  Window: 'Hour' | 'Day' | 'Month' | 'Year'
  Resolution: 'Minute' | 'Hour' | 'Day' | 'Month'
  First: string
  Last: string
  Count: number
}

export const Stats: React.FunctionComponent = () => {
  const globalClasses = useGlobalStyles()
  const localization = useLocalization()
  const repository = useRepository()
  const [versionInfo, setVersionInfo] = useState<VersionInfo>()
  const [dashboardData, setDashboardData] = useState<DashboardData>()
  const [periodData, setPeriodData] = useState<RawPeriodData>()

  useEffect(() => {
    ;(async () => {
      const response = await repository.executeAction<any, RawPeriodData>({
        idOrPath: '/Root',
        name: 'GetApiUsagePeriods',
        method: 'POST',
        body: {
          timeWindow: 'Month',
        },
      })

      setPeriodData(response)
    })()
  }, [repository])

  useEffect(() => {
    ;(async () => {
      const response = await repository.executeAction<any, VersionInfo>({
        idOrPath: '/Root',
        name: 'GetVersionInfo',
        method: 'GET',
      })

      setVersionInfo(response)
    })()
  }, [repository])

  useEffect(() => {
    ;(async () => {
      const response = await repository.executeAction<any, DashboardData>({
        idOrPath: '/Root',
        name: 'GetDashboardData',
        method: 'GET',
        oDataOptions: {
          select: ['Plan'],
        },
      })

      setDashboardData(response)
    })()
  }, [repository])

  if (!versionInfo || !dashboardData || !periodData) return <FullScreenLoader />

  return (
    <div style={{ overflow: 'auto' }}>
      <div className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)} style={{ display: 'grid' }}>
        <span style={{ fontSize: '20px' }}>{localization.settings.stats}</span>
      </div>
      <Container fixed>
        <StorageWidget data={dashboardData} />
        <UsageWidget periodData={periodData && makePeriodArrayFromRawData(periodData)} />
        <ComponentsWidget data={versionInfo} />
        <InstalledPackagesWidget data={versionInfo} />
      </Container>
    </div>
  )
}

export default Stats
