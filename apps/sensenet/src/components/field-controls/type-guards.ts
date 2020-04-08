import { CurrencyFieldSetting, FieldSetting, GenericContent, User } from '@sensenet/default-content-types'

/**
 * Typeguard for user. Lets typescript know that the content is a User.
 * @param {GenericContent} content
 * @returns {content is User}
 */
export function isUser(content: GenericContent): content is User {
  return content.Type === 'User'
}

/**
 * Typeguard to check if the setting is a CurrencyFieldSetting
 * @param {FieldSetting} fieldSetting
 * @returns {fieldSetting is CurrencyFieldSetting}
 */
export function isCurrencyFieldSetting(fieldSetting: FieldSetting): fieldSetting is CurrencyFieldSetting {
  return Object.prototype.hasOwnProperty.call(fieldSetting, 'Format') || fieldSetting.Type === 'CurrencyFieldSetting'
}
