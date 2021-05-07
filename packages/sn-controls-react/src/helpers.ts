import { FieldSetting } from '@sensenet/default-content-types'

/**
 * Search for '[Script:jScript]' tag in string and returns empty string when found
 */
export const changeTemplatedValue = (value: string | undefined, evaluatedValue?: string | undefined) => {
  if (value?.includes('@@')) {
    return evaluatedValue
  } else if (value?.includes('[Script:jScript]')) {
    return ''
  } else {
    return value
  }
}

export const isFullWidthField = (field: { fieldSettings: FieldSetting }, contentType: string, parentType: string) => {
  return (
    (field.fieldSettings.Name === 'Avatar' && (contentType === 'User' || parentType === 'User')) ||
    (field.fieldSettings.Name === 'Enabled' && (contentType === 'User' || parentType === 'User')) ||
    (field.fieldSettings.Name === 'Enabled' &&
      (contentType === 'WebHookSubscription' || parentType === 'WebHookSubscription')) ||
    field.fieldSettings.Type === 'LongTextFieldSetting'
  )
}

const units = ['byte', 'KB', 'MB', 'GB', 'TB']

export const round = (num: number, precision = 1) => {
  const multiplier = Math.pow(10, precision)
  return Math.round((num + Number.EPSILON) * multiplier) / multiplier
}

export const formatSize = (fieldValueNumber: number, index = 0): string => {
  const inHigherUnit = round(fieldValueNumber / 1024)
  if (inHigherUnit >= 1 && units.length > index + 1) {
    return formatSize(inHigherUnit, index + 1)
  } else {
    return `${fieldValueNumber} ${units[index]}`
  }
}
