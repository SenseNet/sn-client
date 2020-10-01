import { FieldSetting } from '@sensenet/default-content-types'

/**
 * Search for '[Script:jScript]' tag in string and returns empty string when found
 */

export const changeTemplatedValue = (value: string | undefined, evaluatedValue?: string | undefined) => {
  if (value && value.includes('@@')) {
    return evaluatedValue
  } else if (value && value.includes('[Script:jScript]')) {
    return ''
  } else {
    return value
  }
}

export const isFullWidthField = (field: { fieldSettings: FieldSetting }, contentType: string) => {
  return (
    (field.fieldSettings.Name === 'Avatar' && contentType.includes('User')) ||
    (field.fieldSettings.Name === 'Enabled' && contentType.includes('User')) ||
    field.fieldSettings.Type === 'LongTextFieldSetting'
  )
}
