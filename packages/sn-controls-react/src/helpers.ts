/**
 * Search for '[Script:jScript]' tag in string and returns empty string when found
 */
export const changeJScriptValue = (value: string | undefined) =>
  value && (value.includes('[Script:jScript]') ? '' : value)
