import { Container } from '@material-ui/core'
import { useRepository, VersionInfo } from '@sensenet/hooks-react'
import { clsx } from 'clsx'
import React, { useEffect, useState } from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { DashboardData } from '../dashboard/types'
import { FullScreenLoader } from '../full-screen-loader'
import { ComponentsWidget } from './stats-components-widget'
import { InstalledPackagesWidget } from './stats-installed-packages-widget'
import { StorageWidget } from './stats-storage-widget'

export const Stats: React.FunctionComponent = () => {
  const globalClasses = useGlobalStyles()
  const localization = useLocalization()
  const repository = useRepository()
  const [versionInfo, setVersionInfo] = useState<VersionInfo>()
  const [dashboardData, setDashboardData] = useState<DashboardData>()
  const [versionInfoError, setVersionInfoError] = useState<boolean>(false)
  const [dashboardDataError, setDashboardDataError] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      try {
        const response = await repository.executeAction<any, VersionInfo>({
          idOrPath: '/Root',
          name: 'GetVersionInfo',
          method: 'GET',
        })

        setVersionInfo(response)
      } catch {
        setVersionInfoError(true)
      }
    })()
  }, [repository])

  useEffect(() => {
    ;(async () => {
      try {
        const response = await repository.executeAction<any, DashboardData>({
          idOrPath: '/Root',
          name: 'GetDashboardData',
          method: 'GET',
          oDataOptions: {
            select: ['Plan'],
          },
        })

        setDashboardData(response)
      } catch {
        setDashboardDataError(true)
      }
    })()
  }, [repository])

  if ((!versionInfo && !versionInfoError) || (!dashboardData && !dashboardDataError)) return <FullScreenLoader />

  return (
    <div style={{ overflow: 'auto' }}>
      <div className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)} style={{ display: 'grid' }}>
        <span style={{ fontSize: '20px' }}>{localization.settings.stats}</span>
      </div>
      <Container fixed>
        {dashboardData && !dashboardDataError && <StorageWidget data={dashboardData} />}
        {versionInfo && !versionInfoError && (
          <>
            <ComponentsWidget data={versionInfo} />
            <InstalledPackagesWidget data={versionInfo} />
          </>
        )}
      </Container>
    </div>
  )
}

export default Stats
