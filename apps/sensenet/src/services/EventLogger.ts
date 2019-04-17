import { Injectable } from '@furystack/inject'
import { AbstractLogger, ILeveledLogEntry } from '@furystack/logging'
import { EventService } from './EventService'

@Injectable()
export class EventLogger extends AbstractLogger {
  public async addEntry<T>(entry: ILeveledLogEntry<T>): Promise<void> {
    this.eventService.add(entry)
  }

  constructor(private readonly eventService: EventService) {
    super()
    ;(window as any).addEvent = this.addEntry.bind(this)
  }
}
