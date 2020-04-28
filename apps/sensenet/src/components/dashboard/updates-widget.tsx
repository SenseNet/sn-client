import React from 'react'
import WbSunnyTwoTone from '@material-ui/icons/WbSunnyTwoTone'
import {
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core'
import { useVersionInfo } from '@sensenet/hooks-react'
import { Widget } from '../../services/PersonalSettings'
import { useLocalization, useStringReplace, useTheme } from '../../hooks'

export const UpdatesWidget: React.FunctionComponent<Widget<undefined>> = (props) => {
  const replacedTitle = useStringReplace(props.title)
  const { hasUpdates, versionInfo } = useVersionInfo()
  const localization = useLocalization().dashboard.updates
  const theme = useTheme()
  const inheritedClasses = props.classes

  return (
    <div className={inheritedClasses.root}>
      <Typography variant="h2" title={props.title} gutterBottom={true} className={inheritedClasses.title}>
        {replacedTitle}
      </Typography>
      <div style={{ overflow: 'auto', height: '100%' }}>
        {hasUpdates ? (
          <List>
            {versionInfo?.Components.filter((v) => v.IsUpdateAvailable).map((info) => (
              <ListItem key={info.ComponentId}>
                <ListItemAvatar style={{ minWidth: 24 }}>
                  <div style={{ width: 8, height: 8, backgroundColor: theme.palette.text.secondary }} />
                </ListItemAvatar>
                <ListItemText
                  primary={`${info.ComponentId} ${info.Version} to ${(info.NugetManifest as any).items[0].upper}`}
                  secondary={info.Description}
                />
                <ListItemSecondaryAction>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                    href={`https://www.nuget.org/packages/${info.ComponentId}`}>
                    <Button variant="contained">{localization.view}</Button>
                  </a>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Paper
            className={inheritedClasses.container}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              flexDirection: 'column',
            }}
            elevation={0}>
            <Typography gutterBottom style={{ fontStyle: 'italic' }}>
              {localization.allUpToDate}
            </Typography>
            <WbSunnyTwoTone style={{ width: 200, height: 200, margin: '1em' }} />
          </Paper>
        )}
      </div>
    </div>
  )
}
