import { LogLevel } from '@furystack/logging'
import amber from '@material-ui/core/colors/amber'
import red from '@material-ui/core/colors/red'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import Close from '@material-ui/icons/Close'
import { sleepAsync } from '@sensenet/client-utils'
import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { InjectorContext, ResponsiveContext } from '../context'
import { EventLogEntry, EventService } from '../services/EventService'
import { Icon } from './Icon'

export const getItemColor = (item: EventLogEntry<any>) => {
  switch (item.level) {
    case LogLevel.Error:
    case LogLevel.Fatal:
      return red[800]
    case LogLevel.Warning:
      return amber[500]
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
  const injector = useContext(InjectorContext)
  const eventService = injector.getInstance(EventService)
  const [values, setValues] = useState<Array<[string, Array<EventLogEntry<any>>]>>([])
  const [dismisses, setDismisses] = useState<string[]>([])
  const device = useContext(ResponsiveContext)

  useEffect(() => {
    const subscription = eventService.notificationValues.subscribe(change =>
      setValues(Array.from(Object.entries(change))),
    )
    return () => subscription.dispose()
  }, [])

  return (
    <div>
      {values.map((v, i) => {
        const item = v[1][0]
        return (
          <Snackbar
            key={i}
            open={item.data.isDismissed !== true && dismisses.indexOf(item.data.guid) === -1}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            style={{
              marginBottom:
                values.filter(val => val[1][0].data.isDismissed !== true).indexOf(v) * (device === 'mobile' ? 60 : 90),
            }}
            ContentProps={{
              style: {
                backgroundColor: getItemColor(item),
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
              },
            }}
            autoHideDuration={getAutoHideDuration(item)}
            message={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon item={item} style={{ marginRight: '.5em' }} />
                {item.message}
              </div>
            }
            onClose={(_ev, reason) => {
              if (reason === 'timeout') {
                setDismisses([...dismisses, item.data.guid])
              }
            }}
            action={
              <IconButton
                color="inherit"
                onClick={async () => {
                  setDismisses([...dismisses, item.data.guid])
                  await sleepAsync(500)
                  eventService.dismiss(item)
                }}>
                <Close />
              </IconButton>
            }
          />
        )
      })}
    </div>
  )
}
