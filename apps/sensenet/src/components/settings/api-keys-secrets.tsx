import { useRepository } from '@sensenet/hooks-react'
import {
  CircularProgress,
  createStyles,
  IconButton,
  InputLabel,
  makeStyles,
  Paper,
  TextField,
  Theme,
} from '@material-ui/core'
import { Refresh } from '@material-ui/icons'
import React, { useEffect, useState } from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { ApiKey, ApiKeyType, Secret } from './api-key'
import { Tab } from './api-keys-tab'
import { TabPanel } from './api-keys-tab-panel'
import { Tabs } from './api-keys-tabs'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    description: {
      marginBottom: '2rem',
      '& a': {
        color: theme.palette.primary.main,
        textDecoration: 'underline',
      },
    },
    inputLabel: {
      display: 'flex',
      alignItems: 'flex-end',
      marginBottom: '0.5rem',
    },
    input: {
      paddingTop: '10px',
      paddingBottom: '10px',
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
    },
    refreshIcon: { marginLeft: '0.5rem', padding: 0 },
  })
})

export const ApiSecretsWidget: React.FunctionComponent = () => {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const repo = useRepository()
  const localization = useLocalization().settings
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [externalClients, setExternalClients] = useState<ApiKey[]>([])
  const [externalSpas, setExternalSpas] = useState<ApiKey[]>([])

  const regenerateApiKey = async (client: ApiKey) => {
    setIsRegenerating(true)
    const response = await repo.executeAction<any, Secret>({
      idOrPath: '/Root',
      name: 'RegenerateSecretForRepository',
      method: 'POST',
      body: {
        clientId: client.clientId,
        secretId: client.secrets[0]?.id,
      },
    })

    setExternalSpas(
      externalClients.map((externalClient) => {
        if (externalClient.secrets[0].id === response.id) {
          externalClient.secrets[0] = response
        }
        return client
      }),
    )
    setIsRegenerating(false)
  }

  useEffect(() => {
    ;(async () => {
      const response = await repo.executeAction<any, { clients: ApiKey[] }>({
        idOrPath: '/Root',
        name: 'GetClientsForRepository',
        method: 'GET',
      })

      setExternalClients(response.clients.filter((client) => client.type === ApiKeyType.ExternalClient))
      setExternalSpas(response.clients.filter((client) => client.type === ApiKeyType.ExternalSpa))
    })()
  }, [repo])

  function a11yPropsForTab(index: number) {
    return {
      id: `api-key-tab-${index}`,
      'aria-controls': `api-key-tabpanel-${index}`,
    }
  }

  return (
    <>
      <Tabs value={activeTabIndex} aria-label={localization.apiKeys} onChange={(_, value) => setActiveTabIndex(value)}>
        <Tab label={localization.yourAppId} {...a11yPropsForTab(0)} />
        <Tab label={localization.personalAccessToken} {...a11yPropsForTab(1)} />
      </Tabs>

      <TabPanel value={activeTabIndex} index={0}>
        <p className={classes.description} dangerouslySetInnerHTML={{ __html: localization.spaDescription }} />
        {externalSpas.map((spa) => (
          <Paper key={spa.clientId} className={globalClasses.cardRoot}>
            <InputLabel shrink htmlFor={spa.clientId} className={classes.inputLabel}>
              {localization.clientId}
            </InputLabel>
            <TextField
              name={spa.clientId}
              variant="outlined"
              fullWidth
              value={spa.clientId}
              inputProps={{
                readOnly: true,
                className: classes.input,
              }}
            />
          </Paper>
        ))}
      </TabPanel>

      <TabPanel value={activeTabIndex} index={1}>
        <p className={classes.description} dangerouslySetInnerHTML={{ __html: localization.clientDescription }} />
        {externalClients.map((client) => (
          <Paper key={client.clientId} className={globalClasses.cardRoot}>
            <div style={{ marginBottom: '1rem' }}>
              <InputLabel shrink htmlFor={client.clientId} className={classes.inputLabel}>
                {localization.clientId}
              </InputLabel>
              <TextField
                name={client.clientId}
                variant="outlined"
                fullWidth
                value={client.clientId}
                inputProps={{
                  readOnly: true,
                  className: classes.input,
                }}
              />
            </div>

            <div>
              <InputLabel shrink htmlFor="repository" className={classes.inputLabel}>
                {localization.clientSecret}
                <IconButton
                  disabled={isRegenerating}
                  onClick={() => regenerateApiKey(client)}
                  className={classes.refreshIcon}>
                  <Refresh aria-label={localization.regenerate} />
                </IconButton>
              </InputLabel>
              {isRegenerating ? (
                <CircularProgress color="primary" size={32} />
              ) : (
                <TextField
                  name="repository"
                  variant="outlined"
                  fullWidth
                  value={client.secrets[0].value}
                  inputProps={{
                    readOnly: true,
                    className: classes.input,
                  }}
                />
              )}
            </div>
          </Paper>
        ))}
      </TabPanel>
    </>
  )
}
