import { LeveledLogEntry, LogEntry } from '.'

/**
 * Log entry without scope variable
 */
export type LogEntryWithoutScope<T> = Exclude<LogEntry<T>, { scope: string }>

/**
 * Leveled log entry without scope variable
 */
export type LeveledLogEntryWithoutScope<T> = Exclude<LeveledLogEntry<T>, { scope: string }>

/**
 * A logger instance with predefined scopes
 */
export interface ScopedLogger {
  /**
   * Adds a custom log entry
   */
  addEntry: <T>(entry: LeveledLogEntryWithoutScope<T>, isVerbose?: boolean) => Promise<void>

  /**
   * Adds a Verbose log entry. Verbose is the noisiest level, rarely (if ever) enabled for a production app.
   */
  verbose: <T>(entry: LogEntryWithoutScope<T>) => Promise<void>

  /**
   * Adds a debug log entry. Debug is used for internal system events that are not necessarily observable from the outside, but useful when determining how something happened.
   */
  debug: <T>(entry: LogEntryWithoutScope<T>) => Promise<void>

  /**
   * Adds an Information log entry. Information events describe things happening in the system that correspond to its responsibilities and functions. Generally these are the observable actions the system can perform.
   */
  information: <T>(entry: LogEntryWithoutScope<T>) => Promise<void>

  /**
   * Adds a Warning log entry. When service is degraded, endangered, or may be behaving outside of its expected parameters, Warning level events are used.
   */
  warning: <T>(entry: LogEntryWithoutScope<T>) => Promise<void>

  /**
   * Adds an Error log entry. When functionality is unavailable or expectations broken, an Error event is used.
   */
  error: <T>(entry: LogEntryWithoutScope<T>) => Promise<void>

  /**
   * Adds a Fatal log entry. The most critical level, Fatal events demand immediate attention.
   */
  fatal: <T>(entry: LogEntryWithoutScope<T>) => Promise<void>
}

/**
 * Interface that defines a Logger implementation
 */
export interface Logger {
  /**
   * Adds a custom log entry
   */
  addEntry: <T>(entry: LeveledLogEntry<T>, isVerbose?: boolean) => Promise<void>

  /**
   * Adds a Verbose log entry. Verbose is the noisiest level, rarely (if ever) enabled for a production app.
   */
  verbose: <T>(entry: LogEntry<T>) => Promise<void>

  /**
   * Adds a debug log entry. Debug is used for internal system events that are not necessarily observable from the outside, but useful when determining how something happened.
   */
  debug: <T>(entry: LogEntry<T>) => Promise<void>

  /**
   * Adds an Information log entry. Information events describe things happening in the system that correspond to its responsibilities and functions. Generally these are the observable actions the system can perform.
   */
  information: <T>(entry: LogEntry<T>) => Promise<void>

  /**
   * Adds a Warning log entry. When service is degraded, endangered, or may be behaving outside of its expected parameters, Warning level events are used.
   */
  warning: <T>(entry: LogEntry<T>) => Promise<void>

  /**
   * Adds an Error log entry. When functionality is unavailable or expectations broken, an Error event is used.
   */
  error: <T>(entry: LogEntry<T>) => Promise<void>

  /**
   * Adds a Fatal log entry. The most critical level, Fatal events demand immediate attention.
   */
  fatal: <T>(entry: LogEntry<T>) => Promise<void>

  /**
   * Returns an object that contains shortcuts to the original logger that contains the provided scope.
   *
   * usage example:
   * ```ts
   * const scopedLogger = myLogger.withScope("myLogScope")
   *
   * scopedLogger.information({message: "foo"}) // will add an information entry with the provided scope
   * ```
   */
  withScope: (scope: string) => ScopedLogger
}
