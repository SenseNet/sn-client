import { RepositoryContext } from '@sensenet/hooks-react'
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import DeleteOutlined from '@material-ui/icons/DeleteOutlined'
import EditOutlined from '@material-ui/icons/EditOutlined'
import NotesIcon from '@material-ui/icons/Notes'
import RoomIcon from '@material-ui/icons/Room'
import WatchIcon from '@material-ui/icons/Watch'
import moment from 'moment'
import React, { useContext, useState } from 'react'
import striptags from 'striptags'
import CalendarEvent from '../CalendarEvent-type'
import { SharedContext } from '../context/shared-context'
import { DialogComponent } from './simple-dialog'

export interface EditDialogBodyDialogProps {
  content: CalendarEvent
  dialogClose: (value: boolean) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listitemroot: {
      width: '100%',
      maxWidth: 450,
      padding: 0,
      backgroundColor: theme.palette.background.paper,
    },
    ml15: {
      marginLeft: '15px',
    },
    card: {
      boxShadow: 'none',
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: '#4d8ead',
    },
    icon: {
      fontSize: '2rem',
    },
    button: {
      padding: '4px',
    },
    notificationmargin: {
      margin: theme.spacing(1),
    },
  }),
)

export const ViewDialogBody: React.FunctionComponent<EditDialogBodyDialogProps> = (props) => {
  const classes = useStyles()
  const repo = useContext(RepositoryContext)
  const sharedcontext = useContext(SharedContext)
  const [openmodal, setOpenmodal] = useState(false)

  const dateTimeDisplay = (event: CalendarEvent) => {
    if (event.AllDay) {
      return 'All day'
    }
    if (moment(event.StartDate).isSame(event.EndDate, 'day')) {
      return `${moment(event.StartDate).format('dddd, MMM-DD HH:mm')} - ${moment(event.EndDate).format('HH:mm')}`
    } else {
      return `${moment(event.StartDate).format('dddd, MMM-DD HH:mm')} - ${moment(event.EndDate).format(
        'dddd, MMM-DD HH:mm',
      )}`
    }
  }

  const deleteEvent = async (userevent: boolean, event: CalendarEvent) => {
    if (userevent) {
      await repo.delete({ idOrPath: event.Path, permanent: true })
      sharedcontext.setRefreshcalendar(!sharedcontext.refreshcalendar)
      sharedcontext.setOpendisplaymodal(false)
      sharedcontext.setOpennoti(true)
    } else {
      setOpenmodal(false)
    }
  }

  return (
    <>
      <Card className={classes.card}>
        <CardContent>
          <Grid container direction="row" justify="flex-end">
            <Grid item>
              <IconButton
                aria-label="remove"
                className={classes.button}
                onClick={() => {
                  setOpenmodal(true)
                }}>
                <DeleteOutlined className={classes.icon} />
              </IconButton>
              <IconButton
                aria-label="edit"
                className={classes.button}
                onClick={() => {
                  sharedcontext.setEvent(props.content)
                  sharedcontext.setOpeneditmodal(true)
                }}>
                <EditOutlined className={classes.icon} />
              </IconButton>
            </Grid>
          </Grid>
          <Grid container direction="column" justify="center">
            <Grid item>
              <Typography variant="h5" component="h2" className={classes.ml15}>
                {props.content.DisplayName}
              </Typography>
            </Grid>
            <Grid item>
              <List className={classes.listitemroot}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <WatchIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Date" secondary={dateTimeDisplay(props.content)} />
                </ListItem>
              </List>
            </Grid>
            <Grid item>
              <List className={classes.listitemroot}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <RoomIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Location" secondary={props.content.Location} />
                </ListItem>
              </List>
            </Grid>
            <Grid item>
              <List className={classes.listitemroot}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <NotesIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Description"
                    secondary={props.content.Description !== undefined ? striptags(props.content.Description) : ''}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <DialogComponent
        open={openmodal}
        title={props.content.DisplayName ? props.content.DisplayName : ''}
        onClose={(userevent) => {
          deleteEvent(userevent, props.content)
        }}
      />
    </>
  )
}
