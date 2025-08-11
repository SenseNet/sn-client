/* eslint-disable import/order */
import {
  createStyles,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  Tooltip,
} from '@material-ui/core'
import { useRepository } from '@sensenet/hooks-react'
import React, { lazy, useEffect, useState } from 'react'
import logoUrl from '../assets/sensenet_white.png'
import { DateTimeFormatter } from './grid/Formatters/DateTimeFormatter'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useAuth } from '../context/auth-provider'

const DashboardComponent = lazy(() => import(/* webpackChunkName: "dashboard" */ './dashboard'))

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    homeCont: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      color: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
    },
    title: {
      display: 'flex',
      gap: '32px',
      padding: '16px',
      justifyContent: 'center',
      alignItems: 'center',
      '& img': {
        backgroundColor: 'black',
        filter: theme.palette.type === 'light' ? 'invert(1)' : '',
      },
      '& h1': {
        fontSize: '32px',
      },
    },
    sensenetLogo: {
      width: 60,
      height: 60,
    },
    gridsCont: {
      width: '100%',
      height: '100%',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
    },
    gridCont: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 20px 20px 20px',
      borderTop: theme.palette.type === 'light' ? '1px solid #DBDBDB' : '1px solid #2c2c2c',
      '& h2': {
        textAlign: 'center',
      },
      overflow: 'auto',
    },
    accordion: {
      backgroundColor: theme.palette.type === 'light' ? '#f9f9f9' : '#333',
      color: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
      marginBottom: '8px',
      '&.Mui-expanded': {
        margin: 0,
      },
    },
    accordionSummary: {
      display: 'flex',
      alignItems: 'center',
      '& .MuiAccordionSummary-content': {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 3fr',
        gap: '16px',
        [theme.breakpoints.down(600)]: {
          gridTemplateColumns: '1fr',
        },
      },
      '&.Mui-expanded': {
        minHeight: 'unset',
      },
    },
    accordionSummaryContent: {
      '&.Mui-expanded': {
        margin: '8px 0 8px 0',
      },
    },
    accordionDetails: {
      padding: '16px',
      borderTop: `1px solid ${theme.palette.type === 'light' ? '#DBDBDB' : '#2c2c2c'}`,
    },
    truncatedText: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    fixedItem: {
      maxWidth: '150px',
      flexShrink: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      marginRight: '1rem',
    },

    contentPathItem: {
      flexGrow: 1,
      minWidth: 0,
    },
  }),
)

export const Home = () => {
  const classes = useStyles()
  const repo = useRepository()
  const { user } = useAuth()

  const [lastMinuteLogs, setLastMinuteLogs] = useState<any[]>([])
  const [myLogs, setMyLogs] = useState<any[]>([])
  const [hasGetLogs, setHasGetLogs] = useState(false)
  const [hasGetTopLogsByUser, setHasGetTopLogsByUser] = useState(false)

  useEffect(() => {
    async function getActionsAndLogs() {
      try {
        const { d } = await repo.getActions({ idOrPath: '/Root' })
        const actionNames = d.results.map((a: any) => a.Name)

        const canGetLogs = actionNames.includes('GetLogsForLastMinutes')
        const canGetUserLogs = actionNames.includes('GetTopLogsByUser')

        setHasGetLogs(canGetLogs)
        setHasGetTopLogsByUser(canGetUserLogs)

        if (canGetLogs) await getLatestChanges()
        if (canGetUserLogs) await getMyChanges()
      } catch (error: any) {
        console.error('Fetching actions failed:', error.message)
      }
    }

    async function getLatestChanges() {
      try {
        const response = await repo.executeAction<any[], any>({
          idOrPath: '/Root',
          name: 'LogEntries/GetLogsForLastMinutes',
          method: 'GET',
          oDataOptions: {
            top: 100,
            minutes: 600,
          } as any,
        })

        if (response) {
          setLastMinuteLogs(response.filter((res: any) => res.ContentPath !== '/Root/System/Cache/DatabaseUsage.cache'))
        } else {
          setHasGetLogs(false)
        }
      } catch (error: any) {
        console.error('GetLogsForLastMinutes error:', error.message)
        setHasGetLogs(false)
      }
    }

    async function getMyChanges() {
      try {
        const response = await repo.executeAction<any[], any>({
          idOrPath: '/Root',
          name: 'LogEntries/GetTopLogsByUser',
          method: 'GET',
          oDataOptions: {
            userName: user?.LoginName,
          } as any,
        })
        if (response) {
          setMyLogs(response)
        } else {
          setHasGetTopLogsByUser(false)
        }
      } catch (error: any) {
        console.error('GetTopLogsByUser error:', error.message)
        setHasGetTopLogsByUser(false)
      }
    }

    getActionsAndLogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getTable = (log: any) => {
    const changes = log.ExtendedProperties?.ChangedData
    if (!changes) return null
    const rows = changes
      .map((change: any[]) => {
        const nameObj = change.find((obj) => obj.name)
        const oldValueObj = change.find((obj) => obj.oldValue)
        const newValueObj = change.find((obj) => obj.newValue)

        if (!nameObj || nameObj.name === 'raw') return null

        return {
          key: nameObj.name,
          oldValue: oldValueObj?.oldValue ?? '—',
          newValue: newValueObj?.newValue ?? '—',
        }
      })
      .filter(Boolean)
    return (
      <Table size="small" style={{ width: '100%' }}>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
              <strong>Old Value</strong>
            </TableCell>
            <TableCell>
              <strong>New Value</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: any, idx: any) => (
            <TableRow key={idx}>
              <TableCell style={{ verticalAlign: 'top' }}>
                <strong>{row.key}</strong>
              </TableCell>
              <TableCell>{row.oldValue}</TableCell>
              <TableCell>{row.newValue}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return !hasGetLogs && !hasGetTopLogsByUser ? (
    <DashboardComponent />
  ) : (
    <div className={classes.homeCont}>
      <div className={classes.title}>
        <img src={logoUrl} alt="Logo" className={classes.sensenetLogo} />
        <h1>Sensenet</h1>
      </div>
      <div className={classes.gridsCont}>
        {hasGetLogs && (
          <div className={classes.gridCont}>
            <h2>Latest Changes</h2>
            {lastMinuteLogs.map((log, index) => {
              const hasChanges = log.ExtendedProperties?.ChangedData?.length > 0
              return (
                <Accordion key={index} className={classes.accordion} disabled={!hasChanges}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                    className={classes.accordionSummary}
                    classes={{ content: classes.accordionSummaryContent }}>
                    <Typography className={classes.fixedItem}>
                      {log.LogDate ? DateTimeFormatter({ value: log.LogDate }) : ''}
                    </Typography>
                    <Typography className={classes.fixedItem}>{log.Message || ''}</Typography>
                    <Typography className={classes.fixedItem}>{log.UserName || ''}</Typography>
                    <Tooltip title={log.ContentPath || ''} arrow>
                      <Typography className={`${classes.contentPathItem} ${classes.truncatedText}`}>
                        {log.ContentPath || ''}
                      </Typography>
                    </Tooltip>
                  </AccordionSummary>
                  {hasChanges && (
                    <AccordionDetails className={classes.accordionDetails}>{getTable(log)}</AccordionDetails>
                  )}
                </Accordion>
              )
            })}
          </div>
        )}

        {hasGetTopLogsByUser && (
          <div className={classes.gridCont}>
            <h2>My Changes</h2>
            {myLogs.map((log, index) => {
              const hasChanges = log.ExtendedProperties?.ChangedData?.length > 0
              return (
                <Accordion key={index} className={classes.accordion} disabled={!hasChanges}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                    className={classes.accordionSummary}>
                    <Typography className={classes.fixedItem}>
                      {log.LogDate ? DateTimeFormatter({ value: log.LogDate }) : ''}
                    </Typography>
                    <Typography className={classes.fixedItem}>{log.Message || ''}</Typography>
                    <Typography className={classes.fixedItem}>{log.UserName || ''}</Typography>
                    <Tooltip title={log.ContentPath || ''} arrow>
                      <Typography className={`${classes.contentPathItem} ${classes.truncatedText}`}>
                        {log.ContentPath || ''}
                      </Typography>
                    </Tooltip>
                  </AccordionSummary>
                  {hasChanges && (
                    <AccordionDetails className={classes.accordionDetails}>{getTable(log)}</AccordionDetails>
                  )}
                </Accordion>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
