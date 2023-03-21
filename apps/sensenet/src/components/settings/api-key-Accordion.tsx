import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  createStyles,
  makeStyles,
  Theme,
  Tooltip,
} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import { ExpandMore, Refresh } from '@material-ui/icons'
import { convertUtcToLocale } from '@sensenet/client-utils'
import React from 'react'
import { globals, widgetStyles } from '../../globalStyles'
import { ApiKey, Secret } from './api-key'

interface ApiKeyAccordionProps {
  client: ApiKey
  handleCopyClientClick: Function
  clientIdLocalization: string
  noExpirationLocalization: string
  clientSecretLocalization: string
  expiratinDateLocalization: string
  regenerateLocalization: string
  regenerateApiKey: Function
  isRegenerating: boolean
}

const useWidgetStyles = makeStyles(widgetStyles)

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    refreshIcon: {
      padding: '5px',
    },
    secondaryInfo: {
      fontSize: '0.7rem',
      color: `hsl(174deg 3% ${theme.palette.type === 'light' ? '41' : '74'}%)`,
    },
    ApiKeyCard: {
      cursor: 'pointer',
      borderRadius: '5px',
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column',
      maxWidth: '350px',
      '&.Mui-expanded': {
        margin: 0,
      },
      '&:before': {
        content: 'none',
      },
      '& .MuiAccordionSummary-root': {
        boxShadow: globals.common.elavationShadow,
        padding: '7px 10px',
        borderRadius: '5px',
        columnGap: '10px',
      },
      '& .MuiAccordionSummary-expandIcon': {
        marginRight: '-5px',
        paddingRight: '12px',
        paddingLeft: '12px',
      },
      '& .MuiAccordionSummary-root.Mui-disabled': {
        opacity: 1,
      },
      '& .MuiAccordionSummary-root .MuiAccordionSummary-content': {
        flex: 1,
        columnGap: '5px',
        alignItems: 'baseline',
        justifyContent: 'space-evenly',
      },
      '& .MuiAccordionDetails-root': {
        boxShadow: globals.common.elavationShadow,
        borderRadius: '5px',
        marginTop: '10px',
        marginBottom: '39px',
        wordBreak: 'break-all',
        padding: '0px',
        flexDirection: 'column',
      },
      '& .MuiAccordionDetails-root > div': {
        borderRadius: 'inherit',
        position: 'relative',
        padding: '0.8rem 1.5rem',
      },
      '& .validTill': {
        fontSize: '0.8rem',
        opacity: 0.3,
        flex: 1,
        textAlign: 'center',
      },
      '& .secret-container': {
        height: 'calc(3 * 1.5rem)',
      },
      '& .additional': {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      '& .lock-icon': {
        position: 'absolute',
        left: 0,
        marginLeft: '3px',
        fontSize: '18px',
        opacity: 0.6,
      },
    },
  })
})

export const ApiKeyAccordion = (props: ApiKeyAccordionProps) => {
  const {
    client,
    handleCopyClientClick,
    clientIdLocalization,
    noExpirationLocalization,
    expiratinDateLocalization,
    regenerateLocalization,
    clientSecretLocalization,
    regenerateApiKey,
    isRegenerating,
  } = props

  const classes = useStyles()

  const { container: keyContainer } = useWidgetStyles()

  const apiSecrects: Secret[] = client.secrets

  return (
    <Accordion key={client.clientId} className={classes.ApiKeyCard} elevation={0}>
      <AccordionSummary
        className={keyContainer}
        disabled={!apiSecrects.length}
        expandIcon={apiSecrects.length ? <ExpandMore /> : undefined}>
        <Box>
          <span className={classes.secondaryInfo}>{client.type}</span>
        </Box>
        <Box onClick={(event) => handleCopyClientClick(event, client.clientId, clientIdLocalization)}>
          <Tooltip title={clientIdLocalization}>
            <b>{client.clientId}</b>
          </Tooltip>
        </Box>
      </AccordionSummary>
      {apiSecrects.length ? (
        <AccordionDetails>
          {apiSecrects.map((secret, index) => {
            const { value, validTill } = secret

            const expiration =
              validTill === '9999-12-31T23:59:59.9999999' ? noExpirationLocalization : convertUtcToLocale(validTill)
            return (
              <Box className={keyContainer} key={value}>
                <Tooltip
                  onClick={(event) => handleCopyClientClick(event, value, clientSecretLocalization)}
                  title={clientSecretLocalization}>
                  <Box className="secret-container">{value}</Box>
                </Tooltip>
                <Box className="additional">
                  <Tooltip title={expiratinDateLocalization}>
                    <Box className="validTill">{expiration}</Box>
                  </Tooltip>

                  <Tooltip title={regenerateLocalization}>
                    <IconButton
                      disabled={isRegenerating}
                      onClick={() => regenerateApiKey(client, index)}
                      className={classes.refreshIcon}>
                      <Refresh aria-label={regenerateLocalization} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            )
          })}
        </AccordionDetails>
      ) : null}
    </Accordion>
  )
}
