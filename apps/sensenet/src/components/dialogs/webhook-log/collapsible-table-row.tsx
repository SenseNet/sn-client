import { Box, Collapse, createStyles, makeStyles, TableCell, TableRow, Theme, useTheme } from '@material-ui/core'
import { FiberManualRecord } from '@material-ui/icons'
import React, { useState } from 'react'
import { useLocalization } from '../../../hooks'
import { useDateUtils } from '../../../hooks/use-date-utils'
import { WebhookStatInput } from './types'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    row: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
    icon: {
      height: '20px',
      width: '20px',
      marginRight: '16px',
    },
    cell: {
      display: 'flex',
      alignItems: 'center',
    },
    actionCell: {
      color: theme.palette.primary.main,
      cursor: 'pointer',
      textDecoration: 'underline',
    },
    box: {
      display: 'flex',
    },
    title: {
      color: theme.palette.primary.main,
      paddingRight: '16px',
    },
  })
})

export function CollapsibleTableRow(props: { row: WebhookStatInput }) {
  const classes = useStyles()
  const theme = useTheme()
  const localization = useLocalization().webhookLogDialog
  const dateUtils = useDateUtils()
  const [open, setOpen] = useState(false)

  return (
    <React.Fragment>
      <TableRow className={classes.row}>
        <TableCell align="left">
          {dateUtils.formatDate(new Date(props.row.CreationTime), 'yyyy-MM-dd HH:mm aaa')}
        </TableCell>
        <TableCell align="center" className={classes.cell}>
          <FiberManualRecord
            className={classes.icon}
            style={{
              color:
                props.row.ResponseStatusCode < 300
                  ? theme.palette.primary.main
                  : props.row.ResponseStatusCode < 400
                  ? '#ffac33'
                  : '#c62828',
            }}
          />
          <span> HTTP {props.row.ResponseStatusCode}</span>
        </TableCell>
        <TableCell className={classes.actionCell} align="right" onClick={() => setOpen(!open)}>
          {localization.details}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1} className={classes.box}>
              <div style={{ width: '50%' }}>
                <div>
                  <span className={classes.title}>{localization.requestTime}</span>
                  {dateUtils.formatDate(new Date(props.row.CreationTime), 'yyyy-MM-dd HH:mm aaa')}
                </div>
                <div>
                  <span className={classes.title}>{localization.requestLength}</span>
                  {props.row.RequestLength}
                </div>
                <div>
                  <span className={classes.title}>{localization.webhookId}</span>
                  {props.row.WebHookId}
                </div>
                <div>
                  <span className={classes.title}>{localization.eventName}</span>
                  {props.row.EventName}
                </div>
              </div>
              <div style={{ width: '50%' }}>
                <div>
                  <span className={classes.title}>{localization.duration}</span>
                  {props.row.Duration}
                </div>
                <div>
                  <span className={classes.title}>{localization.responseLength}</span>
                  {props.row.ResponseLength}
                </div>
                <div>
                  <span className={classes.title}>{localization.contentId}</span>
                  {props.row.ContentId}
                </div>
                <div>
                  <span className={classes.title}>{localization.errorMessage}</span>
                  {props.row.ErrorMessage}
                </div>
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}
