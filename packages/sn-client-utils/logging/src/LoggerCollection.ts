import { Injectable } from '@furystack/inject'
import { AbstractLogger } from './AbstractLogger'
import { LeveledLogEntry } from './LogEntries'
import { Logger } from './Logger'

/**
 * A specific logger that forwards its messages to a collection of loggers
 */
@Injectable({ lifetime: 'singleton' })
export class LoggerCollection extends AbstractLogger {
  public async addEntry<T>(entry: LeveledLogEntry<T>): Promise<void> {
    const promises = this.loggers.map(l => l.addEntry(entry))
    await Promise.all(promises)
  }

  private loggers: Logger[] = []
  public attachLogger(...loggers: Logger[]) {
    this.loggers.push(...loggers)
  }
}
