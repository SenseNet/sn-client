import { ActionModel, User } from '.'

/**
 * Type guard for ActionModel
 */
export function isActionModel(actions: any): actions is ActionModel[] {
  return Array.isArray(actions) && !!actions.length && 'Name' in actions[0]
}

/**
 * Type guard for user. Lets typescript know that the content is a User.
 * @param {any} content
 * @returns {content is User}
 */
export function isUser(content: any): content is User {
  if ('Type' in content) {
    return content.Type === 'User'
  }
  throw new Error(`There is no Type field in ${JSON.stringify(content)}`)
}
