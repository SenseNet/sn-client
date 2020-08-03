import { Injectable } from '..'
import { NotificationService } from './notification-service'
import { AbstractLogger, LeveledLogEntry, LogLevel } from '.'

@Injectable({ lifetime: 'scoped' })
export class NotificationLogger extends AbstractLogger {
  private logLevels = ['Information', 'Warning', 'Error', 'Fatal']

  public useLogLevels(loglevels: string[]) {
    this.logLevels = loglevels
  }

  public async addEntry<T>(entry: LeveledLogEntry<T>) {
    if (this.logLevels.includes(LogLevel[entry.level] as keyof typeof LogLevel)) {
      this.notificationService.add(entry)
    }
  }

  constructor(private readonly notificationService: NotificationService) {
    super()
  }
}
