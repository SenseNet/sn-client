import { LeveledLogEntry, LeveledLogEntryWithoutScope, LogEntry, LogEntryWithoutScope, Logger, LogLevel } from '.'

/**
 * Default scope key for the Abstract Logger
 */
export const AbstractLoggerScope = '@sensenet/client-utils/AbstractLogger'

/**
 * Abstract logger instance
 */
export abstract class AbstractLogger implements Logger {
  /**
   * Adds a new log entry to the logger
   * @param entry The Log entry object
   */
  public abstract addEntry<T>(entry: LeveledLogEntry<T>): Promise<void>

  private async addEntryInternal<T>(entry: LeveledLogEntry<T>) {
    try {
      await this.addEntry(entry)
    } catch (error) {
      this.error({
        scope: AbstractLoggerScope,
        message: 'There was an error adding entry to the log',
        data: {
          entry,
          error,
        },
      })
    }
  }

  /**
   * Adds a Verbose level log entry. Verbose is the noisiest level, rarely (if ever) enabled for a production app.
   * @param entry The Log entry
   */
  public async verbose<T>(entry: LogEntry<T>) {
    await this.addEntryInternal({
      ...entry,
      level: LogLevel.Verbose,
    })
  }

  /**
   * Adds a Debug level log entry. Debug is used for internal system events that are not necessarily observable from the outside, but useful when determining how something happened.
   * @param entry  The Log entry
   */
  public async debug<T>(entry: LogEntry<T>) {
    await this.addEntryInternal({
      ...entry,
      level: LogLevel.Debug,
    })
  }

  /**
   * Adds an Information level log entry. Information events describe things happening in the system that correspond to its responsibilities and functions. Generally these are the observable actions the system can perform.
   * @param entry  The Log entry
   */
  public async information<T>(entry: LogEntry<T>) {
    await this.addEntryInternal({
      ...entry,
      level: LogLevel.Information,
    })
  }

  /**
   * Adds a Warning level log entry. When service is degraded, endangered, or may be behaving outside of its expected parameters, Warning level events are used.
   * @param entry  The Log entry
   */
  public async warning<T>(entry: LogEntry<T>) {
    await this.addEntryInternal({
      ...entry,
      level: LogLevel.Warning,
    })
  }

  /**
   * Adds an Error level log entry. When functionality is unavailable or expectations broken, an Error event is used.
   * @param entry  The Log entry
   */
  public async error<T>(entry: LogEntry<T>) {
    try {
      await this.addEntry({
        ...entry,
        level: LogLevel.Error,
      })
    } catch (error) {
      await this.fatal({
        scope: AbstractLoggerScope,
        message:
          'There was an error persisting an Error event in the log and therefore the event was elevated to Fatal level.',
        data: {
          originalEntry: entry,
          error,
        },
      })
    }
  }

  /**
   * Adds a Fatal level log entry. The most critical level, Fatal events demand immediate attention.
   * @param entry  The Log entry
   */
  public async fatal<T>(entry: LogEntry<T>) {
    await this.addEntry({
      ...entry,
      level: LogLevel.Fatal,
    })
  }

  /**
   * Returns an object that contains shortcuts to the original logger that contains the provided scope.
   * usage example:
   * ```ts
   *  const scopedLogger = myLogger.withScope("myLogScope")
   *  scopedLogger.information({message: "foo"}) // will add an information entry with the provided scope
   * ```
   */

  public withScope = (scope: string) => ({
    /**
     * Adds a custom log entry
     */
    addEntry: <T>(entry: LeveledLogEntryWithoutScope<T>) => this.addEntry<T>({ scope, ...entry }),

    /**
     * Adds a Verbose log entry. Verbose is the noisiest level, rarely (if ever) enabled for a production app.
     */
    verbose: <T>(entry: LogEntryWithoutScope<T>) => this.verbose({ scope, ...entry }),

    /**
     * Adds a debug log entry. Debug is used for internal system events that are not necessarily observable from the outside, but useful when determining how something happened.
     */
    debug: <T>(entry: LogEntryWithoutScope<T>) => this.debug({ scope, ...entry }),

    /**
     * Adds an Information log entry. Information events describe things happening in the system that correspond to its responsibilities and functions. Generally these are the observable actions the system can perform.
     */
    information: <T>(entry: LogEntryWithoutScope<T>) => this.information({ scope, ...entry }),

    /**
     * Adds a Warning log entry. When service is degraded, endangered, or may be behaving outside of its expected parameters, Warning level events are used.
     */
    warning: <T>(entry: LogEntryWithoutScope<T>) => this.warning({ scope, ...entry }),

    /**
     * Adds an Error log entry. When functionality is unavailable or expectations broken, an Error event is used.
     */
    error: <T>(entry: LogEntryWithoutScope<T>) => this.error({ scope, ...entry }),

    /**
     * Adds a Fatal log entry. The most critical level, Fatal events demand immediate attention.
     */
    fatal: <T>(entry: LogEntryWithoutScope<T>) => this.fatal({ scope, ...entry }),
  })
}
