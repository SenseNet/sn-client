/**
 * Convert a UTC date string to a local date object.
 * @param utcDateString The UTC date string to convert.
 * @returns The local date object, or with error message on concole.
 * @example '2022-03-21T15:30:00.000Z'-> 2023-03-21 15:30:00.
 */
export function convertUtcToLocale(utcDateString: string) {
  try {
    const date = new Date(utcDateString)

    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    } as const

    return new Intl.DateTimeFormat(window.navigator.language, options).format(date)
  } catch (error) {
    return console.error(error.message)
  }
}
