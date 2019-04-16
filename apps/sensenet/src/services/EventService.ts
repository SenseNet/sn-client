import { Injectable } from '@furystack/inject'
import { ILeveledLogEntry } from '@furystack/logging'
import { debounce, ObservableValue } from '@sensenet/client-utils'
import { v1 } from 'uuid'

export type EventLogEntry<T> = ILeveledLogEntry<T & { guid: string; isDismissed?: boolean }>

@Injectable({ lifetime: 'singleton' })
export class EventService {
  public static debounceInterval = 100

  public dismiss(entry: EventLogEntry<any>) {
    this.values = this.values.map(e => {
      if (e.data.guid === entry.data.guid) {
        return { ...e, data: { ...e.data, isDismissed: true } }
      }
      return e
    })
    this.updateChanges()
  }

  public updateChanges = debounce(() => {
    this.notificationValues.setValue(this.getDigestedNotificationValues())
  }, EventService.debounceInterval)

  public add(...notys: Array<EventLogEntry<any>>) {
    this.values.push(...notys.map(n => ({ ...n, data: { ...n.data, guid: v1() } })))
    if (notys.find(n => n.data && n.data.shouldNotify)) {
      this.updateChanges()
    }
  }

  public notificationValues: ObservableValue<{ [key: string]: Array<EventLogEntry<any>> }> = new ObservableValue({})

  public values: Array<EventLogEntry<any & { guid: string }>> = []

  public getDigestedNotificationValues(): { [key: string]: Array<EventLogEntry<any>> } {
    const notyValues = this.values.filter(d => d.data && d.data.shouldNotify).reverse()
    const returns: { [key: string]: Array<EventLogEntry<any>> } = {}

    for (const noty of notyValues) {
      const key = noty.data.unique ? noty.message : noty.data.digestMessage || noty.data.guid
      if (returns[key]) {
        returns[key].push(noty)
      } else {
        returns[key] = [noty]
      }
    }

    return returns
  }
}
