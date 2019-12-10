import React from 'react'
import InfoIcon from '@material-ui/icons/Info'
import {
  Avatar,
  Container,
  createStyles,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { useLocalization } from '../../hooks'
import businessCatImg from './businesscat.jpeg'
import devDogImg from './devdog.jpg'
import editorManateeImg from './editormanatee.jpg'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    infoBox: {
      backgroundColor: theme.palette.primary.main,
    },
    marginBottom: {
      marginBottom: theme.spacing(1),
    },
    listItemText: {
      flex: '1 1',
      textAlign: 'left',
    },
    title: {
      margin: theme.spacing(2, 0, 3),
    },
  }),
)
export interface DemoUser {
  userName: string
  avatarUrl: string
  role: string
  info: string
}

const demoUsers: DemoUser[] = [
  {
    userName: 'businesscat',
    avatarUrl: businessCatImg,
    role: 'Admin',
    info: 'Business Cat is an admin user with full access.',
  },
  {
    userName: 'devdog',
    avatarUrl: devDogImg,
    role: 'Developer',
    info:
      'Developer Dog is developer user who has control only over the content types, the settings and can see the version info.',
  },
  {
    userName: 'editormanatee',
    avatarUrl: editorManateeImg,
    role: 'Editor',
    info:
      'Editor Manatee is a content editor who can manage the non-system content items, build or save custom search queries.',
  },
]

type InfoBoxProps = {
  onSelect: (demoUser: DemoUser) => void
}

export function InfoBox({ onSelect }: InfoBoxProps) {
  const classes = useStyles()
  const localization = useLocalization().login

  return (
    <Grid container={true} direction="row" className={classes.infoBox} justify="space-around">
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" className={classes.title}>
          {localization.loginTitle}
        </Typography>
        <Typography className={classes.marginBottom}>
          It possible to log in to the admin UI also if you don’t have your own repository yet, so you can explore its
          functionalities (upload, create etc.) managing content of a{' '}
          <a href="https://www.sensenet.com/try-it/1000-content-demo" target="blank">
            public demo repository
          </a>
          . Below you can see the credentials for different built-in role types that has different permission settings.
          To learn more about the settings see the info bubble.
        </Typography>
        <Typography className={classes.marginBottom}>
          Please notice that the demo repository is rebuilt every day, and do not use it with sensitive documents. Our
          team is actively working on the system, so we might be under maintenance, and some bugs are normal at this
          point.
        </Typography>
        <Typography className={classes.marginBottom}>
          To log in and start exploring the repository click one of the following users below.
        </Typography>
        <List>
          {demoUsers.map((demoUser, index) => (
            <ListItem button key={index} onClick={() => onSelect(demoUser)}>
              <ListItemAvatar>
                <Avatar src={demoUser.avatarUrl} />
              </ListItemAvatar>
              <ListItemText className={classes.listItemText} primary={demoUser.userName} />
              <ListItemText className={classes.listItemText} primary={demoUser.role} />
              <ListItemSecondaryAction>
                <Tooltip title={demoUser.info}>
                  <InfoIcon />
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Container>
    </Grid>
  )
}
