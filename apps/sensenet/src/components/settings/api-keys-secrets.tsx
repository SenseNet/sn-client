import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Box from '@material-ui/core/Box/Box'
import { copyToClipboard } from '@sensenet/client-utils'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import React, { useState } from 'react'
import { globals } from '../../globalStyles'
import { useGetClients, useLocalization } from '../../hooks'
import { ApiKey, clientTypes, Secret } from './api-key'
import { Tab } from './api-keys-tab'
import { TabPanel } from './api-keys-tab-panel'
import { Tabs } from './api-keys-tabs'
import { ApiKeyAccordion } from './apikey-accordion'

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
    ApiKeysContainer: {
      display: 'flex',
      columnGap: '15px',
      flexWrap: 'wrap',
      padding: '1rem 0px',
      rowGap: '15px',
    },
    clientCard: {
      maxWidth: '50ch',
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
    refreshIcon: {
      padding: '5px',
    },
    secondaryInfo: {
      fontSize: '0.7rem',
      color: `hsl(174deg 3% ${theme.palette.type === 'light' ? '41' : '74'}%)`,
    },
    appClientID: {
      alignItems: 'flex-end',
      columnGap: '5px',
      display: 'flex',
    },
  })
})

export const ApiSecretsWidget: React.FunctionComponent = () => {
  const classes = useStyles()
  const repo = useRepository()
  const { spas, clients, unAuthorizedRequest, setClients, setSpas } = useGetClients()
  const { settings: settingLocalization, errorBoundary } = useLocalization()
  const logger = useLogger('ApiSecretsWidgets')
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [isRegenerating, setIsRegenerating] = useState(false)

  const handleCopyClientClick = (event: React.MouseEvent<HTMLElement, MouseEvent>, value: string, title: string) => {
    event.stopPropagation()
    const copy = copyToClipboard(value)

    if (!copy) {
      return logger.error({ message: errorBoundary.title })
    }

    return logger.information({ message: `${title} ${settingLocalization.copiedToClipboard}` })
  }

  const regenerateApiKey = async (client: ApiKey, secretIndex: number) => {
    setIsRegenerating(true)

    const response = await repo
      .executeAction<any, Secret>({
        idOrPath: '/Root',
        name: 'RegenerateSecretForRepository',
        method: 'POST',
        body: {
          clientId: client.clientId,
          secretId: client.secrets[secretIndex]?.id,
        },
      })
      .catch(() => {
        setIsRegenerating(false)
        logger.error({ message: settingLocalization.unavailableRegenSecret })
        return false
      })

    if (!response) {
      return false
    }

    if (clientTypes.includes(client.type as any)) {
      setClients((prevState) => {
        const clientIndex = prevState.findIndex((prevclient) => prevclient.clientId === client.clientId)

        const updatedClient = {
          ...prevState[clientIndex],
          secrets: [...prevState[clientIndex].secrets],
        }

        updatedClient.secrets[secretIndex] = response as Secret

        const updatedClients = [...prevState]
        updatedClients[clientIndex] = updatedClient

        return updatedClients
      })

      setIsRegenerating(false)

      return
    }

    setSpas((prevState) => {
      const clientIndex = prevState.findIndex((prevclient) => prevclient.clientId === client.clientId)

      const updatedClient = {
        ...prevState[clientIndex],
        secrets: [...prevState[clientIndex].secrets],
      }

      updatedClient.secrets[secretIndex] = response as Secret

      const updatedClients = [...prevState]
      updatedClients[clientIndex] = updatedClient

      return updatedClients
    })

    setIsRegenerating(false)
  }

  const Accordionlocalization = {
    clientIdLocalization: settingLocalization.clientId,
    noExpirationLocalization: settingLocalization.noExpiration,
    expiratinDateLocalization: settingLocalization.expiratinDate,
    regenerateLocalization: settingLocalization.regenerate,
    clientSecretLocalization: settingLocalization.clientSecret,
  }

  function a11yPropsForTab(index: number) {
    return {
      id: `api-key-tab-${index}`,
      'aria-controls': `api-key-tabpanel-${index}`,
    }
  }

  if (unAuthorizedRequest) {
    return null
  }

  return (
    <>
      <Tabs
        value={activeTabIndex}
        aria-label={settingLocalization.apiKeys}
        onChange={(_, value) => setActiveTabIndex(value)}>
        <Tab label={settingLocalization.yourAppId} {...a11yPropsForTab(0)} />
        <Tab data-test="spas-tab" label={settingLocalization.personalAccessToken} {...a11yPropsForTab(1)} />
      </Tabs>

      <TabPanel value={activeTabIndex} index={0}>
        <p className={classes.description} dangerouslySetInnerHTML={{ __html: settingLocalization.spaDescription }} />
        <Box display="flex" className={classes.ApiKeysContainer} data-test="client-keys">
          {clients?.map((client: ApiKey) => {
            return (
              <ApiKeyAccordion
                handleCopyClientClick={handleCopyClientClick}
                client={client}
                key={client.clientId}
                regenerateApiKey={regenerateApiKey}
                isRegenerating={isRegenerating}
                {...Accordionlocalization}
              />
            )
          })}
        </Box>
      </TabPanel>

      <TabPanel value={activeTabIndex} index={1}>
        <p
          className={classes.description}
          dangerouslySetInnerHTML={{ __html: settingLocalization.clientDescription }}
        />
        <Box className={classes.ApiKeysContainer} data-test="spa-keys">
          {spas?.map((client) => (
            <ApiKeyAccordion
              handleCopyClientClick={handleCopyClientClick}
              client={client}
              key={client.clientId}
              regenerateApiKey={regenerateApiKey}
              isRegenerating={isRegenerating}
              {...Accordionlocalization}
            />
          ))}
        </Box>
      </TabPanel>
    </>
  )
}
