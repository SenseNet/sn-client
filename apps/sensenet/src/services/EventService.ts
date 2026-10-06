import { debounce, Injectable, LeveledLogEntry, LogLevel, ObservableValue } from '@sensenet/client-utils'
import { v1 } from 'uuid'
import { PersonalSettings } from './PersonalSettings'

export type EventLogEntry<T> = LeveledLogEntry<T & { guid: string; isDismissed?: boolean }>

@Injectable({ lifetime: 'singleton' })
export class EventService {
  public static digestNotificationDebounceInterval = 100
  public static storageDebounceInterval = 1000

  public static storageKey = `sn-app-eventservice-events`
  private static maxStoredEventLogLength = 500000

  public dismiss(entry: EventLogEntry<any>) {
    this.values.setValue(
      this.values.getValue().map((e) => {
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
    const entries = values.slice(values.length - this.personalSettings.effectiveValue.getValue().eventLogSize)
    EventService.storeEntries(entries)
  }, EventService.storageDebounceInterval)

  private static storeEntries(entries: Array<EventLogEntry<any>>) {
    try {
      localStorage.setItem(EventService.storageKey, JSON.stringify(entries))
    } catch {
      try {
        localStorage.setItem(EventService.storageKey, JSON.stringify(EventService.getCompactEntries(entries)))
      } catch {
        localStorage.removeItem(EventService.storageKey)
      }
    }
  }

  private static getStoredEntries(): Array<EventLogEntry<any & { guid: string }>> {
    const storedEntries = localStorage.getItem(EventService.storageKey)

    if (!storedEntries) {
      return []
    }

    if (storedEntries.length > EventService.maxStoredEventLogLength) {
      localStorage.removeItem(EventService.storageKey)
      return []
    }

    try {
      const parsedEntries = JSON.parse(storedEntries)

      return Array.isArray(parsedEntries) ? EventService.getCompactEntries(parsedEntries) : []
    } catch {
      localStorage.removeItem(EventService.storageKey)
      return []
    }
  }

  private static getCompactEntries(entries: Array<EventLogEntry<any>>) {
    return entries.map((entry) => ({
      ...entry,
      data: {
        added: entry.data?.added,
        digestMessage: entry.data?.digestMessage,
        guid: entry.data?.guid,
        isDismissed: entry.data?.isDismissed,
        multiple: entry.data?.multiple,
      },
    }))
  }

  public add(...notifications: Array<EventLogEntry<any>>) {
    // const newValues = this.values.getValue().push())
    this.values.setValue([
      ...notifications.map((n) => ({ ...n, data: { ...n.data, guid: v1(), added: new Date().toISOString() } })),
      ...this.values.getValue(),
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
    EventService.getStoredEntries(),
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
      .filter((d) => !d.data || !d.data.isDismissed)
      .filter((d) => d.data.added > notFrom)
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
