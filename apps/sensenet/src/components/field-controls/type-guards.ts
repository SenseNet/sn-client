import { CurrencyFieldSetting, FieldSetting } from '@sensenet/default-content-types'

/**
 * Typeguard to check if the setting is a CurrencyFieldSetting
 * @param {FieldSetting} fieldSetting
 * @returns {fieldSetting is CurrencyFieldSetting}
 */
export function isCurrencyFieldSetting(fieldSetting: FieldSetting): fieldSetting is CurrencyFieldSetting {
  return Object.prototype.hasOwnProperty.call(fieldSetting, 'Format') || fieldSetting.Type === 'CurrencyFieldSetting'
}
