import { AbstractLogger, colors, LeveledLogEntry, LogLevel } from '.'
import { Injectable } from '..'

/**
 * Resets the console color
 */
export const Reset = '\x1b[0m'

/**
 * Black console foreground color
 */

export const FgBlack = '\x1b[30m'

/**
 * Red console foreground color
 */
export const FgRed = '\x1b[31m'

/**
 * Green console foreground color
 */
export const FgGreen = '\x1b[32m'

/**
 * Yellow console foreground color
 */
export const FgYellow = '\x1b[33m'

/**
 * Blue console foreground color
 */
export const FgBlue = '\x1b[34m'

/**
 * Magentaa console foreground color
 */
export const FgMagenta = '\x1b[35m'

/**
 * Cyan console foreground color
 */
export const FgCyan = '\x1b[36m'

/**
 * White console foreground color
 */
export const FgWhite = '\x1b[37m'

/**
 * Returns an associated color to a specific log level
 */
export const getLevelColor = (level: LogLevel, isBrowser = false) => {
  let color: string
  switch (level) {
    case LogLevel.Verbose:
      color = isBrowser ? colors.darkblue : FgBlue
      break
    case LogLevel.Debug:
      color = isBrowser ? colors.darkblue : FgBlue
      break
    case LogLevel.Information:
      color = isBrowser ? colors.darkgreen : FgGreen
      break
    case LogLevel.Warning:
      color = isBrowser ? colors.darkorange : FgYellow
      break
    case LogLevel.Error:
      color = isBrowser ? colors.darkred : FgRed
      break
    default:
      color = isBrowser ? colors.darkred : FgRed
      break
  }

  return color
}

/**
 * The default formatter for the Console logger
 * @param entry the log entry to be formatted
 */
export const defaultFormatter = <T>(entry: LeveledLogEntry<T>, isVerbose: boolean) => {
  const fontColor = getLevelColor(entry.level)
  const formattedEntry = [`${fontColor}%s${Reset}`, entry.scope, entry.message]
  return entry.data && isVerbose ? [...formattedEntry, entry.data] : formattedEntry
}

/**
 * The formatter for browsers like Firefox, Chrome
 * @param entry the log entry to be formatted
 */
export const browserFormatter = <T>({ level, message, data, scope }: LeveledLogEntry<T>) => {
  if (!scope) {
    return data ? [message, data] : [message]
  }
  const fontColor = getLevelColor(level, true)
  const formattedEntry = [`%c[${scope}]:`, `color: ${fontColor}`, message]
  return data ? [...formattedEntry, data] : formattedEntry
}

/**
 * A logger implementation that dumps log messages to the console
 */
@Injectable({ lifetime: 'scoped' })
export class ConsoleLogger extends AbstractLogger {
  public async addEntry<T>(entry: LeveledLogEntry<T>, isVerbose = false) {
    const data = defaultFormatter(entry, isVerbose)

    console.log(...data)
  }
}

@Injectable({ lifetime: 'scoped' })
export class BrowserConsoleLogger extends AbstractLogger {
  public async addEntry<T>(entry: LeveledLogEntry<T>) {
    const data = browserFormatter(entry)

    console.log(...data)
  }
}
