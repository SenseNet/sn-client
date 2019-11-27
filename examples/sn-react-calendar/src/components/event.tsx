import React, { useContext } from 'react'
import moment from 'moment'
import { Avatar, createStyles, List, ListItem, ListItemAvatar, ListItemText, makeStyles } from '@material-ui/core'
import { User } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import CalendarEvent from '../CalendarEvent-type'
import defavatar from '../assets/avatar-default.png'
import { SharedContext } from '../context/shared-context'

const useStyles = makeStyles(theme =>
  createStyles({
    parentlistelement: {
      display: 'flex',
      flexDirection: 'row-reverse',
      minWidth: '600px',
      border: '1px solid rgba(0, 0, 0, 0.12)',
      borderRadius: '2%',
      marginBottom: '7px',
      '&:hover': {
        backgroundColor: '#bad892',
        cursor: 'pointer',
      },
      [theme.breakpoints.down('sm')]: {
        minWidth: '0',
        width: '100%',
      },
    },
    alldayevent: {
      backgroundColor: '#d3daff',
    },
    simpleevent: {
      backgroundColor: 'azure',
    },
  }),
)

export interface EventComponentProps {
  event: CalendarEvent[]
}

const EventComponent: React.FunctionComponent<EventComponentProps> = props => {
  const classes = useStyles()
  const repo = useRepository()
  const sharedcontext = useContext(SharedContext)
  const timeAndLocationpart = (event: CalendarEvent) => {
    const start = moment(new Date(event.StartDate as string)).format('HH:mm')
    const end = moment(new Date(event.EndDate as string)).format('HH:mm')
    const isAllday = event.AllDay
    const location = event.Location
    const timeDisplay = isAllday ? 'all day' : ` ${start}-${end}`
    return `${timeDisplay} at ${location}`
  }

  return (
    <List>
      {props.event.map(event => {
        return (
          <div key={event.Id}>
            <ListItem
              onClick={() => {
                sharedcontext.setEvent(event)
                sharedcontext.setOpendisplaymodal(true)
              }}
              className={`${classes.parentlistelement} ${event.AllDay ? classes.alldayevent : classes.simpleevent}`}>
              <ListItemAvatar>
                <Avatar
                  alt="Avatar"
                  src={
                    (event.CreatedBy as User).Avatar!.Url === ''
                      ? defavatar
                      : repo.configuration.repositoryUrl + (event.CreatedBy as User).Avatar!.Url
                  }
                />
              </ListItemAvatar>
              <ListItemText primary={event.DisplayName} secondary={timeAndLocationpart(event)} />
            </ListItem>
          </div>
        )
      })}
    </List>
  )
}

export default EventComponent
