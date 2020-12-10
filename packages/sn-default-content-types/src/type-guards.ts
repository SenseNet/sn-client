import { ActionModel, CurrencyFieldSetting, FieldSetting } from '.'

/**
 * Type guard for ActionModel
 */
export function isActionModel(actions: any): actions is ActionModel[] {
  return Array.isArray(actions) && !!actions.length && 'Name' in actions[0]
}

/**
 * Type guard to check if the setting is a CurrencyFieldSetting
 * @param {FieldSetting} fieldSetting
 * @returns {fieldSetting is CurrencyFieldSetting}
 */
export function isCurrencyFieldSetting(fieldSetting: FieldSetting): fieldSetting is CurrencyFieldSetting {
  return Object.prototype.hasOwnProperty.call(fieldSetting, 'Format') || fieldSetting.Type === 'CurrencyFieldSetting'
}
