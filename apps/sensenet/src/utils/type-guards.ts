import { User } from '@sensenet/default-content-types'

/**
 * Typeguard for user. Lets typescript know that the content is a User.
 * @param {any} content
 * @returns {content is User}
 */
export function isUser(content: any): content is User {
  if ('Type' in content) {
    return content.Type === 'User'
  }
  throw new Error(`There is no Type field in ${JSON.stringify(content)}`)
}
