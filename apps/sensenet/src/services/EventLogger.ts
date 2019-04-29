import { Injectable } from '@furystack/inject'
import { AbstractLogger, ILeveledLogEntry, LogLevel } from '@furystack/logging'
import { EventService } from './EventService'
import { PersonalSettings } from './PersonalSettings'

@Injectable()
export class EventLogger extends AbstractLogger {
  public async addEntry<T>(entry: ILeveledLogEntry<T>): Promise<void> {
    if (
      this.personalSettings.currentValue.getValue().logLevel.includes(LogLevel[entry.level] as keyof typeof LogLevel)
    ) {
      this.eventService.add(entry)
    }
  }

  constructor(private readonly eventService: EventService, private readonly personalSettings: PersonalSettings) {
    super()
    ;(window as any).addEvent = this.addEntry.bind(this)
  }
}
