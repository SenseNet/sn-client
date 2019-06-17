import { GenericContent, User } from '@sensenet/default-content-types'

/**
 * Typeguard for user. let typescript know that the content is a User.
 * @param {GenericContent} content
 * @returns {content is User}
 */
export function isUser(content: GenericContent): content is User {
  return content.Type === 'User'
}
