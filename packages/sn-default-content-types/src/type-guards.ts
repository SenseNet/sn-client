import { ActionModel } from '.'

/**
 * Type guard for ActionModel
 */
export function isActionModel(actions: any): actions is ActionModel[] {
  return Array.isArray(actions) && !!actions.length && 'Name' in actions[0]
}
