import { Injectable } from '..'
import { NotificationService } from './notification-service'
import { AbstractLogger, LeveledLogEntry, LogLevel } from '.'

@Injectable({ lifetime: 'scoped' })
export class NotificationLogger extends AbstractLogger {
  public async addEntry<T>(entry: LeveledLogEntry<T>) {
    if (['Information', 'Warning', 'Error', 'Fatal'].includes(LogLevel[entry.level] as keyof typeof LogLevel)) {
      this.notificationService.add(entry)
    }
  }

  constructor(private readonly notificationService: NotificationService) {
    super()
    ;(window as any).addEvent = this.addEntry.bind(this)
  }
}
