import { Injectable } from '../index'

import { AbstractLogger } from './abstract-logger'

import { LeveledLogEntry } from './log-entries'

import { Logger } from './logger'

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
