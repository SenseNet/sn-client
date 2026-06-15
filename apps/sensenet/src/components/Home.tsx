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
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useRepository } from '@sensenet/hooks-react'
import React, { lazy, useEffect, useState } from 'react'
import { useAuth } from '../context/auth-provider'
import { useLocalization } from '../hooks'
import { DateTimeFormatter } from './grid/Formatters/DateTimeFormatter'
import { HomeActivitySummary } from './home-activity-summary'

const DashboardComponent = lazy(() => import(/* webpackChunkName: "dashboard" */ './dashboard'))

const latestChangesLimit = 100
const latestChangesWindowInMinutes = 600

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    homeCont: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      backgroundColor: theme.palette.type === 'light' ? '#f5f7fa' : '#1e1e1e',
      padding: '0 20px',
    },
    title: {
      display: 'flex',
      gap: '24px',
      padding: '16px 0',
      alignItems: 'center',
      borderBottom: `1px solid ${theme.palette.type === 'light' ? '#e0e0e0' : '#333'}`,
      '& img': {
        width: 70,
        height: 70,
        backgroundColor: 'transparent',
        filter: theme.palette.type === 'light' ? 'invert(0)' : 'invert(1)',
      },
      '& h1': {
        fontSize: '36px',
        fontWeight: 600,
        color: theme.palette.type === 'light' ? '#333' : '#fff',
      },
    },
    sensenetLogo: {
      width: 70,
      height: 70,
    },
    gridsCont: {
      gridTemplateColumns: '1fr 1fr',
      gap: '24px',
      marginTop: '20px',
      height: 'calc(100% - 80px)',
      overflowY: 'auto',
    },
    gridCont: {
      backgroundColor: theme.palette.type === 'light' ? '#fff' : '#2c2c2c',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      padding: '0 20px',
      overflowY: 'auto',
      '& h2': {
        fontSize: '24px',
        fontWeight: 500,
        color: theme.palette.type === 'light' ? '#333' : '#fff',
        marginBottom: '16px',
        textAlign: 'left',
      },
    },
    accordion: {
      backgroundColor: theme.palette.type === 'light' ? '#fafafa' : '#3c3c3c',
      borderRadius: '4px',
      marginBottom: '12px',
      '&.Mui-expanded': {
        margin: '0 0 12px 0',
      },
      '&:before': {
        display: 'none',
      },
      '&:hover': {
        cursor: 'default',
      },
    },
    accordionSummary: {
      padding: '12px 16px',
      '& .MuiAccordionSummary-content': {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 3.5fr',
        gap: '12px',
        alignItems: 'center',
        [theme.breakpoints.down(900)]: {
          gridTemplateColumns: '1fr 1fr',
        },
        [theme.breakpoints.down(600)]: {
          gridTemplateColumns: '1fr',
        },
      },
    },
    accordionDetails: {
      padding: '16px',
      backgroundColor: theme.palette.type === 'light' ? '#f9f9f9' : '#444',
      borderTop: `1px solid ${theme.palette.type === 'light' ? '#e0e0e0' : '#555'}`,
    },
    truncatedText: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    fixedItem: {
      maxWidth: '150px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      color: theme.palette.type === 'light' ? '#555' : '#ccc',
    },
    contentPathItem: {
      flexGrow: 1,
      minWidth: 0,
      color: theme.palette.type === 'light' ? '#333' : '#ddd',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0 8px',

      '& th': {
        backgroundColor: theme.palette.type === 'light' ? '#f5f5f5' : '#3c3c3c',
        color: theme.palette.type === 'light' ? '#333' : '#fff',
        fontWeight: 500,
      },
      '& td': {
        color: theme.palette.type === 'light' ? '#666' : '#bbb',
      },
      '& thead th:first-child': {
        backgroundColor: 'unset',
      },
      '& thead th:nth-child(2)': {
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
      },
      '& thead th:last-child': {
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
      },
      '& tbody tr td:first-child': {
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
      },
      '& tbody tr td:last-child': {
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
      },
      '& tbody td:nth-child(2), & tbody td:last-child': {
        wordBreak: 'break-all',
      },
    },
    tableRow: {
      borderRadius: '4px',
      '&:hover': {
        backgroundColor: theme.palette.type === 'light' ? '#f0f0f0' : '#3a3a3a',
      },
    },
    '& :hover': {
      cursor: 'default',
    },
  }),
)

export const Home = () => {
  const classes = useStyles()
  const repo = useRepository()
  const localization = useLocalization().home
  const { user } = useAuth()

  const [lastMinuteLogs, setLastMinuteLogs] = useState<any[]>([])
  // const [myLogs, setMyLogs] = useState<any[]>([])
  const [hasGetLogs, setHasGetLogs] = useState(false)
  // const [hasGetTopLogsByUser, setHasGetTopLogsByUser] = useState(false)
  const [canContentHistory, setCanContentHistory] = useState(false)
  const [contentHistories, setContentHistories] = useState<Record<string, any[]>>({})

  useEffect(() => {
    async function getActionsAndLogs() {
      try {
        const { d } = await repo.getActions({ idOrPath: '/Root' })
        const actionNames = d.results.map((a: any) => a.Name)

        const canGetLogs = actionNames.includes('GetLogsForLastMinutes')
        setCanContentHistory(actionNames.includes('GetTopLogsByContentId'))
        // const canGetUserLogs = actionNames.includes('GetTopLogsByUser')

        setHasGetLogs(canGetLogs)
        // setHasGetTopLogsByUser(canGetUserLogs)

        if (canGetLogs) {
          await getLatestChanges()
        } else {
          setLastMinuteLogs([])
        }
        // if (canGetUserLogs) await getMyChanges()
      } catch (error: any) {
        console.error('Fetching actions failed:', error.message)
        setCanContentHistory(false)
        setHasGetLogs(false)
        setLastMinuteLogs([])
      }
    }

    async function getLatestChanges() {
      try {
        const response = await repo.executeAction<any[], any>({
          idOrPath: '/Root',
          name: 'LogEntries/GetLogsForLastMinutes',
          method: 'GET',
          oDataOptions: {
            limit: latestChangesLimit,
            minutes: latestChangesWindowInMinutes,
            top: latestChangesLimit,
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

    // async function getMyChanges() {
    //   try {
    //     const response = await repo.executeAction<any[], any>({
    //       idOrPath: '/Root',
    //       name: 'LogEntries/GetTopLogsByUser',
    //       method: 'GET',
    //       oDataOptions: {
    //         userName: user?.LoginName,
    //         limit: 100,
    //         minutes: 2400,
    //       } as any,
    //     })
    //     // if (response) {
    //     //   setMyLogs(response)
    //     // } else {
    //     //   setHasGetTopLogsByUser(false)
    //     // }
    //   } catch (error: any) {
    //     console.error('GetTopLogsByUser error:', error.message)
    //     setHasGetTopLogsByUser(false)
    //   }
    // }

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
          oldValue: oldValueObj?.oldValue ?? '',
          newValue: newValueObj?.newValue ?? '',
        }
      })
      .filter(Boolean)
    return (
      <Table size="small" className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
              <strong>{localization.oldValue}</strong>
            </TableCell>
            <TableCell>
              <strong>{localization.newValue}</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: any, idx: any) => (
            <TableRow key={idx} className={classes.tableRow}>
              <TableCell style={{ verticalAlign: 'top' }}>
                <strong>{row.key.replace(/([a-z])([A-Z])/g, '$1 $2')}</strong>
              </TableCell>
              <TableCell>{row.oldValue}</TableCell>
              <TableCell>{row.newValue}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  async function fetchContentHistory(contentId: string) {
    try {
      const response = await repo.executeAction<any[], any>({
        idOrPath: '/Root',
        name: 'LogEntries/GetTopLogsByContentId',
        method: 'GET',
        oDataOptions: { contentId, limit: 10 } as any,
      })
      setContentHistories((prev) => ({
        ...prev,
        [contentId]: response || [],
      }))
    } catch (error: any) {
      console.error('GetTopLogsByContentId error:', error.message)
    }
  }

  return !hasGetLogs ? (
    <DashboardComponent />
  ) : (
    <div className={classes.homeCont}>
      <div className={classes.gridsCont}>
        {hasGetLogs && (
          <div className={classes.gridCont}>
            <HomeActivitySummary
              logs={lastMinuteLogs}
              user={user}
              repositoryUrl={repo.configuration.repositoryUrl}
            />
            <h2>{localization.latestChanges}</h2>
            {lastMinuteLogs.map((log, index) => {
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
                    <Typography className={classes.fixedItem}>
                      {log.Message.replace(/([a-z])([A-Z])/g, '$1 $2') || ''}
                    </Typography>
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
                  {canContentHistory && (
                    <>
                      <Accordion
                        className={''}
                        onClick={() => fetchContentHistory(log.ContentId)}
                        style={{ margin: '8px' }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="content-history-content"
                          id="content-history-header"
                          className={''}>
                          <Typography>{localization.contentHistory}</Typography>
                        </AccordionSummary>
                        <AccordionDetails style={{ display: 'flex', flexDirection: 'column' }}>
                          {(contentHistories[log.ContentId] || []).map((historyLog, idx) => (
                            <div key={idx}>{getTable(historyLog)}</div>
                          ))}
                        </AccordionDetails>
                      </Accordion>
                    </>
                  )}
                </Accordion>
              )
            })}
          </div>
        )}

        {/* {hasGetTopLogsByUser && (
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
        )} */}
      </div>
    </div>
  )
}
