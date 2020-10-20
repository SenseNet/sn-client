import { LeveledLogEntry, LogLevel } from '@sensenet/client-utils'
import amber from '@material-ui/core/colors/amber'
import red from '@material-ui/core/colors/red'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import { Theme, useTheme } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React, { useContext, useEffect, useState } from 'react'
import { ResponsiveContext } from '../context'
import { useNotificationService } from '../hooks/use-notification-service'
import { Icon } from './Icon'

export const getItemBackgroundColor = (item: LeveledLogEntry<any>, theme: Theme) => {
  switch (item.level) {
    case LogLevel.Error:
    case LogLevel.Fatal:
      return red[800]
    case LogLevel.Warning:
      return amber[200]
    default:
      return theme.palette.primary.main
  }
}

export const getItemTextColor = (item: LeveledLogEntry<any>) => {
  switch (item.level) {
    case LogLevel.Error:
    case LogLevel.Fatal:
      return 'white'
    case LogLevel.Warning:
      return 'black'
    default:
      return undefined
  }
}

export const getAutoHideDuration = (item: LeveledLogEntry<any>) => {
  switch (item.level) {
    case LogLevel.Error:
    case LogLevel.Fatal:
      return undefined
    case LogLevel.Warning:
      return 5000
    default:
      return 5000
  }
}

export const NotificationComponent: React.FunctionComponent = () => {
  const notificationService = useNotificationService()
  const [values, setValues] = useState<Array<LeveledLogEntry<any>>>([])
  const [dismisses, setDismisses] = useState<string[]>([])
  const device = useContext(ResponsiveContext)
  const theme = useTheme()

  useEffect(() => {
    const notificationServiceObserve = notificationService.activeMessages.subscribe((change) => {
      setValues(change)
    })
    return function cleanup() {
      notificationServiceObserve.dispose()
    }
  }, [notificationService.activeMessages])

  return (
    <>
      {values.map((value) => {
        const count = values.length
        return (
          <Snackbar
            key={JSON.stringify(value)}
            open={true}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            style={{
              marginBottom: values.indexOf(value) * (device === 'mobile' ? 60 : 90),
            }}
            ContentProps={{
              style: {
                backgroundColor: getItemBackgroundColor(value, theme),
                color: getItemTextColor(value),
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
              },
            }}
            TransitionProps={{ direction: 'left' } as any}
            autoHideDuration={value.data?.autoHideDuration || getAutoHideDuration(value)}
            message={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon item={value} style={{ marginRight: '1em' }} />
                <div
                  title={value.message}
                  style={{ overflow: 'hidden', textOverflow: 'ellipsis', wordBreak: 'break-word' }}>
                  {(count > 1 && value.data?.digestMessage && value.data.digestMessage.replace('{count}', count)) ||
                    value.message}
                </div>
              </div>
            }
            onClose={(_ev, reason) => {
              if (reason === 'timeout') {
                setDismisses([...dismisses, value.data?.guid])
                notificationService.dismiss(value)
              }
            }}
            action={
              <IconButton
                color="inherit"
                onClick={async () => {
                  setDismisses([...dismisses, value.data?.guid])
                  notificationService.dismiss(value)
                }}
                aria-label="Close button">
                <Close />
              </IconButton>
            }
          />
        )
      })}
    </>
  )
}
