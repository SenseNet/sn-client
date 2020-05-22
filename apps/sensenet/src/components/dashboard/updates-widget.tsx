import { useVersionInfo } from '@sensenet/hooks-react'
import React from 'react'
import WbSunnyTwoTone from '@material-ui/icons/WbSunnyTwoTone'
import {
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@material-ui/core'
import { Widget } from '../../services/PersonalSettings'
import { useLocalization, useStringReplace, useTheme } from '../../hooks'

export const UpdatesWidget: React.FunctionComponent<Widget<undefined>> = (props) => {
  const replacedTitle = useStringReplace(props.title)
  const { hasUpdates, versionInfo } = useVersionInfo()
  const localization = useLocalization().dashboard.updates
  const theme = useTheme()

  return (
    <div style={{ height: '100%' }}>
      <Typography
        variant="h5"
        title={props.title}
        gutterBottom={true}
        style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
        {replacedTitle}
      </Typography>
      <div style={{ overflow: 'auto', height: '100%' }}>
        {hasUpdates ? (
          <List>
            {versionInfo &&
              versionInfo.Components.filter((v) => v.IsUpdateAvailable).map((info) => (
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              flexDirection: 'column',
            }}>
            <Typography gutterBottom style={{ fontStyle: 'italic' }}>
              {localization.allUpToDate}
            </Typography>
            <WbSunnyTwoTone style={{ width: 200, height: 200, margin: '1em' }} />
          </div>
        )}
      </div>
    </div>
  )
}
