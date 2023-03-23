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
import React, { useRef, useState } from 'react'
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
      justifyContent: 'flex-start',
      flexDirection: 'column',
      maxWidth: '480px',
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
        pointerEvents: 'auto',
      },
      '& .MuiAccordionSummary-root .MuiAccordionSummary-content': {
        flex: 1,
        columnGap: '20px',
        alignItems: 'center',
        justifyContent: 'space-evenly',
      },
      '& .user-info': {
        flex: 1,
        columnGap: '10px',
        rowGap: '2px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'baseline',
        cursor: 'pointer',
      },
      '& .user-info .user-name': {
        opacity: 0.9,
        fontSize: '0.9rem',
        minWidth: '16ch',
      },
      '& .MuiAccordionDetails-root': {
        boxShadow: globals.common.elavationShadow,
        borderRadius: '5px',
        marginTop: '10px',
        marginBottom: '39px',
        wordBreak: 'break-all',
        padding: '0px',
        flexDirection: 'column',
        rowGap: '15px',
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
      '& .user-secret-container': {
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

  const accordionContentRef = useRef<HTMLDivElement>(null)

  const classes = useStyles()

  const { container: keyContainer } = useWidgetStyles()

  const apiSecrects: Secret[] = client.secrets

  const [expanded, setExpanded] = useState(false)

  const handleChange = (_event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded)
    // if (isExpanded) {
    //   setTimeout(() => {
    //     accordionContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    //   }, 150)
    // }
  }

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      TransitionComponent={undefined}
      TransitionProps={undefined}
      key={client.clientId}
      className={classes.ApiKeyCard}
      elevation={0}
      data-test="api-key-accordion-container">
      <AccordionSummary
        className={keyContainer}
        disabled={!apiSecrects.length}
        expandIcon={apiSecrects.length ? <ExpandMore /> : undefined}>
        <Box className="user-info">
          {client.userName ? <span className="user-name">{client.userName}</span> : null}

          <Box onClick={(event) => handleCopyClientClick(event, client.clientId, clientIdLocalization)}>
            <Tooltip title={clientIdLocalization}>
              <b>{client.clientId}</b>
            </Tooltip>
          </Box>
        </Box>
        <Box data-test="type-container">
          <span className={classes.secondaryInfo}>{client.type}</span>
        </Box>
      </AccordionSummary>
      {apiSecrects.length ? (
        <AccordionDetails data-test="secret-container">
          {apiSecrects.map((secret, index) => {
            const { value, validTill } = secret

            const expiration =
              validTill === '9999-12-31T23:59:59.9999999' ? noExpirationLocalization : convertUtcToLocale(validTill)
            return (
              <div ref={accordionContentRef} className={keyContainer} key={value}>
                <Tooltip
                  onClick={(event) => handleCopyClientClick(event, value, clientSecretLocalization)}
                  title={clientSecretLocalization}>
                  <Box data-test="user-secret-container" className="user-secret-container">
                    {value}
                  </Box>
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
              </div>
            )
          })}
        </AccordionDetails>
      ) : null}
    </Accordion>
  )
}
