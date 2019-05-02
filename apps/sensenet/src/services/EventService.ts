import { Injectable } from '@furystack/inject'
import { ILeveledLogEntry, LogLevel } from '@furystack/logging'
import { debounce, ObservableValue } from '@sensenet/client-utils'
import { v1 } from 'uuid'
import { PersonalSettings } from './PersonalSettings'

export type EventLogEntry<T> = ILeveledLogEntry<T & { guid: string; isDismissed?: boolean }>

@Injectable({ lifetime: 'singleton' })
export class EventService {
  public static digestNotificationDebounceInterval = 100
  public static storageDebounceInterval = 1000

  public static storageKey = `sn-app-eventservice-events`

  public dismiss(entry: EventLogEntry<any>) {
    this.values.setValue(
      this.values.getValue().map(e => {
        if (e.data.guid === entry.data.guid) {
          return { ...e, data: { ...e.data, isDismissed: true } }
        }
        if (e.data.digestMessage && e.data.digestMessage === entry.data.digestMessage) {
          return { ...e, data: { ...e.data, isDismissed: true } }
        }
        return e
      }),
    )
    this.updateChanges()
  }

  public updateChanges = debounce(() => {
    this.notificationValues.setValue(this.getDigestedNotificationValues())
    this.storeChanges()
  }, EventService.digestNotificationDebounceInterval)

  private storeChanges = debounce(() => {
    const values = [...this.values.getValue()]
    const entries = values.slice(values.length - this.personalSettings.currentValue.getValue().eventLogSize)
    localStorage.setItem(EventService.storageKey, JSON.stringify(entries))
  }, EventService.storageDebounceInterval)

  public add(...notifications: Array<EventLogEntry<any>>) {
    // const newValues = this.values.getValue().push())
    this.values.setValue([
      ...this.values.getValue(),
      ...notifications.map(n => ({ ...n, data: { ...n.data, guid: v1(), added: new Date().toISOString() } })),
    ])
    this.updateChanges()
  }

  public clear() {
    this.values.setValue([])
    this.notificationValues.setValue({})
    this.add({ level: LogLevel.Information, message: 'The Event Log has been cleared.', scope: 'EventLog' })
    this.updateChanges()
  }

  public values: ObservableValue<Array<EventLogEntry<any & { guid: string }>>> = new ObservableValue(
    JSON.parse(localStorage.getItem(EventService.storageKey) || '[]') || [],
  )

  public notificationValues: ObservableValue<{ [key: string]: Array<EventLogEntry<any>> }> = new ObservableValue(
    this.getDigestedNotificationValues(),
  )

  public getDigestedNotificationValues(): { [key: string]: Array<EventLogEntry<any>> } {
    const now = new Date()
    now.setMinutes(now.getMinutes() - 2)
    const notFrom = now.toISOString()
    const notificationValues = this.values
      .getValue()
      .filter(d => !d.data || !d.data.isDismissed)
      .filter(d => d.data.added > notFrom)
      .reverse()
    const returns: { [key: string]: Array<EventLogEntry<any>> } = {}

    for (const notification of notificationValues) {
      const key = notification.data.multiple
        ? notification.data.digestMessage || notification.data.guid
        : notification.message
      if (returns[key]) {
        returns[key].push(notification)
      } else {
        returns[key] = [notification]
      }
    }

    return returns
  }

  constructor(private readonly personalSettings: PersonalSettings) {}
}
