/**

 * The verbosity level of a log entry

 */

export enum LogLevel {
  /**
  
     * Verbose is the noisiest level, rarely (if ever) enabled for a production app.
  
     */

  Verbose = 0,

  /**
  
     * Debug is used for internal system events that are not necessarily observable from the outside, but useful when determining how something happened.
  
     */

  Debug = 1,

  /**
  
     * Information events describe things happening in the system that correspond to its responsibilities and functions. Generally these are the observable actions the system can perform.
  
     */

  Information = 2,

  /**
  
     * When service is degraded, endangered, or may be behaving outside of its expected parameters, Warning level events are used.
  
     */

  Warning = 3,

  /**
  
     * When functionality is unavailable or expectations broken, an Error event is used.
  
     */

  Error = 4,

  /**
  
     * The most critical level, Fatal events demand immediate attention.
  
     */

  Fatal = 5,
}

/**

 * A log entry representation

 */

export interface LogEntry<TData> {
  /**
  
     * A well-defined scope for grouping entries, e.g. a component or service name.
  
     */

  scope?: string

  /**
  
     * The message string
  
     */

  message: string

  /**
  
     * Additional entry data
  
     */

  data?: TData
}

/**

 * Interface that represents a log entry with a specific level

 */

export interface LeveledLogEntry<T> extends LogEntry<T> {
  /**
  
     * The verbosity level of the log entry
  
     */

  level: LogLevel
}
