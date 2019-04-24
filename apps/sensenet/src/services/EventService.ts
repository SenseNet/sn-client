import { Injectable } from '@furystack/inject'
import { ILeveledLogEntry } from '@furystack/logging'
import { debounce, ObservableValue } from '@sensenet/client-utils'
import { v1 } from 'uuid'

export type EventLogEntry<T> = ILeveledLogEntry<T & { guid: string; isDismissed?: boolean }>

@Injectable({ lifetime: 'singleton' })
export class EventService {
  public static debounceInterval = 100

  public dismiss(entry: EventLogEntry<any>) {
    this.values.setValue(
      this.values.getValue().map(e => {
        if (e.data.guid === entry.data.guid) {
          return { ...e, data: { ...e.data, isDismissed: true } }
        }
        return e
      }),
    )
    this.updateChanges()
  }

  public updateChanges = debounce(() => {
    this.notificationValues.setValue(this.getDigestedNotificationValues())
  }, EventService.debounceInterval)

  public add(...notys: Array<EventLogEntry<any>>) {
    // const newValues = this.values.getValue().push())
    this.values.setValue([
      ...this.values.getValue(),
      ...notys.map(n => ({ ...n, data: { ...n.data, guid: v1(), added: new Date().toISOString() } })),
    ])
    this.updateChanges()
  }

  public clear() {
    this.values.setValue([])
    this.notificationValues.setValue({})
  }

  public notificationValues: ObservableValue<{ [key: string]: Array<EventLogEntry<any>> }> = new ObservableValue({})

  public values: ObservableValue<Array<EventLogEntry<any & { guid: string }>>> = new ObservableValue([])

  public getDigestedNotificationValues(): { [key: string]: Array<EventLogEntry<any>> } {
    const notyValues = this.values
      .getValue()
      .filter(d => !d.data || !d.data.isDismissed)
      .reverse()
    const returns: { [key: string]: Array<EventLogEntry<any>> } = {}

    for (const noty of notyValues) {
      const key = noty.data.multiple ? noty.data.digestMessage || noty.data.guid : noty.message
      if (returns[key]) {
        returns[key].push(noty)
      } else {
        returns[key] = [noty]
      }
    }

    return returns
  }
}
