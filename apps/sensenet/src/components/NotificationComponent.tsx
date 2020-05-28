import { LogLevel, sleepAsync } from '@sensenet/client-utils'
import { useInjector } from '@sensenet/hooks-react'
import amber from '@material-ui/core/colors/amber'
import red from '@material-ui/core/colors/red'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import Close from '@material-ui/icons/Close'
import React, { useContext, useEffect, useState } from 'react'
import { ResponsiveContext } from '../context'
import { EventLogEntry, EventService } from '../services/EventService'
import { Icon } from './Icon'

export const getItemBackgroundColor = (item: EventLogEntry<any>) => {
  switch (item.level) {
    case LogLevel.Error:
    case LogLevel.Fatal:
      return red[800]
    case LogLevel.Warning:
      return amber[200]
    default:
      return undefined
  }
}

export const getItemTextColor = (item: EventLogEntry<any>) => {
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

export const getAutoHideDuration = (item: EventLogEntry<any>) => {
  switch (item.level) {
    case LogLevel.Error:
    case LogLevel.Fatal:
      return undefined
    case LogLevel.Warning:
      return 15000
    default:
      return 10000
  }
}

export const NotificationComponent: React.FunctionComponent = () => {
  const injector = useInjector()
  const eventService = injector.getInstance(EventService)
  const [values, setValues] = useState<Array<[string, Array<EventLogEntry<any>>]>>([])
  const [dismisses, setDismisses] = useState<string[]>([])
  const device = useContext(ResponsiveContext)

  useEffect(() => {
    const subscription = eventService.notificationValues.subscribe((change) =>
      setValues(Array.from(Object.entries(change))),
    )
    return () => subscription.dispose()
  }, [eventService.notificationValues])

  return (
    <>
      {values.map((v, i) => {
        const item = v[1][0]
        const count = v[1].length
        return (
          <Snackbar
            key={i}
            open={item.data.isDismissed !== true && dismisses.indexOf(item.data.guid) === -1}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            style={{
              marginBottom:
                values.filter((val) => val[1][0].data.isDismissed !== true).indexOf(v) *
                (device === 'mobile' ? 60 : 90),
            }}
            ContentProps={{
              style: {
                backgroundColor: getItemBackgroundColor(item),
                color: getItemTextColor(item),
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
              },
            }}
            TransitionProps={{ direction: 'left' } as any}
            autoHideDuration={(item.data && item.data.autoHideDuration) || getAutoHideDuration(item)}
            message={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon item={item.data.relatedContent || item} style={{ marginRight: '1em' }} />
                <div
                  title={item.message}
                  style={{ overflow: 'hidden', textOverflow: 'ellipsis', wordBreak: 'break-word' }}>
                  {(count > 1 && item.data.digestMessage && item.data.digestMessage.replace('{count}', count)) ||
                    item.message}
                </div>
              </div>
            }
            onClose={(_ev, reason) => {
              if (reason === 'timeout') {
                setDismisses([...dismisses, item.data.guid])
                eventService.dismiss(item)
              }
            }}
            action={
              <IconButton
                color="inherit"
                onClick={async () => {
                  setDismisses([...dismisses, item.data.guid])
                  await sleepAsync(500)
                  eventService.dismiss(item)
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
