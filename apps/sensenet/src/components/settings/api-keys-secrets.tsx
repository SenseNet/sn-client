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

import Box from '@material-ui/core/Box/Box'
import Tooltip from '@material-ui/core/Tooltip'
import { Refresh } from '@material-ui/icons'
import { copyToClipboard } from '@sensenet/client-utils'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { clsx } from 'clsx'
import React, { useEffect, useState } from 'react'
import { globals, useGlobalStyles, widgetStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { ApiKey, clientTypes, Secret, spaTypes } from './api-key'
import { Tab } from './api-keys-tab'
import { TabPanel } from './api-keys-tab-panel'
import { Tabs } from './api-keys-tabs'

const useWidgetStyles = makeStyles(widgetStyles)

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
    label: {
      // fontSize: '0.7rem',
    },
    clientsContainer: {
      columnGap: '15px',
      flexWrap: 'wrap',
      padding: '1rem 0px',
      rowGap: '15px',
    },
    clientCard: {
      width: '35ch',
      cursor: 'pointer',
      boxShadow: globals.common.elavationShadow,
      borderRadius: '5px',
      display: 'flex',
      justifyContent: 'space-between',
    },
    input: {
      paddingTop: '10px',
      paddingBottom: '10px',
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
    },
    refreshIcon: { marginLeft: '0.5rem', padding: 0 },
    secondaryInfo: {
      fontSize: '0.7rem',
      color: `hsl(174deg 3% ${theme.palette.type === 'light' ? '41' : '74'}%)`,
    },
    appClientID: {
      alignItems: 'flex-end',
      columnGap: '5px',
      display: 'flex',
    },
    appClientType: {},
  })
})

export const ApiSecretsWidget: React.FunctionComponent = () => {
  const { container: keyContainer } = useWidgetStyles()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const repo = useRepository()
  const { settings: settingLocalization, errorBoundary } = useLocalization()
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [spas, setSpas] = useState<ApiKey[]>([])
  const [clients, setClients] = useState<ApiKey[]>([])
  const logger = useLogger('ApiSecretsWidgets')
  const handleClientClick = (value: string) => {
    const copy = copyToClipboard(value)

    if (!copy) {
      return logger.error({ message: errorBoundary.title })
    }

    return logger.information({ message: settingLocalization.clientIDCopiedToClipboard })
  }

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

    setClients(
      spas.map((externalClient) => {
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

      setClients(response.clients.filter((client: any) => clientTypes.includes(client.type)))
      setSpas(response.clients.filter((client: any) => spaTypes.includes(client.type)))
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
      <Tabs
        value={activeTabIndex}
        aria-label={settingLocalization.apiKeys}
        onChange={(_, value) => setActiveTabIndex(value)}>
        <Tab label={settingLocalization.yourAppId} {...a11yPropsForTab(0)} />
        <Tab label={settingLocalization.personalAccessToken} {...a11yPropsForTab(1)} />
      </Tabs>

      <TabPanel value={activeTabIndex} index={0}>
        <p className={classes.description} dangerouslySetInnerHTML={{ __html: settingLocalization.spaDescription }} />
        <Box display="flex" className={classes.clientsContainer} data-test="client-keys">
          {clients?.map((client) => (
            <Box
              className={clsx(keyContainer, classes.clientCard)}
              onClick={handleClientClick.bind(null, client.clientId)}
              key={client.clientId}>
              <Box className={classes.appClientID}>
                <Tooltip title={settingLocalization.clientId}>
                  <b>{client.clientId}</b>
                </Tooltip>
              </Box>
              <Box className={classes.appClientType}>
                <span className={classes.secondaryInfo}>{client.type}</span>
              </Box>
            </Box>
          ))}
        </Box>
      </TabPanel>

      {/* <TabPanel value={activeTabIndex} index={1}>
        <p
          className={classes.description}
          dangerouslySetInnerHTML={{ __html: settingLocalization.clientDescription }}
        />
        {spas?.map((client) => (
          <Paper key={client.clientId} className={globalClasses.cardRoot}>
            <div style={{ marginBottom: '1rem' }}>
              <InputLabel shrink htmlFor={client.clientId} className={classes.inputLabel}>
                {settingLocalization.clientId}
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
                {settingLocalization.clientSecret}
                <IconButton
                  disabled={isRegenerating}
                  onClick={() => regenerateApiKey(client)}
                  className={classes.refreshIcon}>
                  <Refresh aria-label={settingLocalization.regenerate} />
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
      </TabPanel> */}
    </>
  )
}
