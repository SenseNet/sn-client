import { Container } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { ApiEndpointWidget } from './api-keys-endpoint-widget'
import { ApiSecretsWidget } from './api-keys-secrets'

export const ApiKeys: React.FunctionComponent = () => {
  const globalClasses = useGlobalStyles()
  const localization = useLocalization()

  return (
    <div style={{ overflow: 'auto' }}>
      <div className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)} style={{ display: 'grid' }}>
        <span style={{ fontSize: '20px' }}>{localization.settings.apiAndSecurity}</span>
      </div>
      <Container fixed>
        <ApiEndpointWidget />
        <ApiSecretsWidget />
      </Container>
    </div>
  )
}

export default ApiKeys
