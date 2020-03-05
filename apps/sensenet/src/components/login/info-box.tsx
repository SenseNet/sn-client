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
          If you are not registered you can log in to our{' '}
          <a
            style={{ textDecoration: 'underline' }}
            href="https://www.sensenet.com/try-it/1000-content-demo"
            target="blank">
            public demo repository
          </a>{' '}
          with one of our built-in users with different roles.
        </Typography>
        <Typography className={classes.marginBottom}>
          Because this is a demo repository, it will be rebuilt every day, so don&apos;t use it with sensitive
          documents. Some bugs are also normal at this point.
        </Typography>
        <Typography className={classes.marginBottom}>
          To log in just click one of the users and start exploring!
        </Typography>
        <List>
          {demoUsers.map((demoUser, index) => (
            <ListItem button key={index} onClick={() => onSelect(demoUser)}>
              <ListItemAvatar>
                <Avatar alt="avatar" src={demoUser.avatarUrl} />
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
