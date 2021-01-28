import { useRepository, VersionInfo } from '@sensenet/hooks-react'
import { Container } from '@material-ui/core'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { ComponentsWidget } from './stats-components-widget'
import { InstalledPackagesWidget } from './stats-installed-packages-widget'
import { StorageWidget } from './stats-storage-widget'
import { UsageWidget } from './stats-usage-widget'

export const Stats: React.FunctionComponent = () => {
  const globalClasses = useGlobalStyles()
  const localization = useLocalization()
  const repository = useRepository()
  const [data, setData] = useState<VersionInfo>()

  useEffect(() => {
    ;(async () => {
      const response = await repository.executeAction<any, VersionInfo>({
        idOrPath: '/Root',
        name: 'GetVersionInfo',
        method: 'GET',
      })

      setData(response)
    })()
  }, [repository])

  if (!data) return null

  return (
    <div style={{ overflow: 'auto' }}>
      <div className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)} style={{ display: 'grid' }}>
        <span style={{ fontSize: '20px' }}>{localization.settings.stats}</span>
      </div>
      <Container fixed>
        <StorageWidget />
        <UsageWidget />
        <ComponentsWidget data={data} />
        <InstalledPackagesWidget data={data} />
      </Container>
    </div>
  )
}

export default Stats
