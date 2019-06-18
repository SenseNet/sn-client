import { GenericContent, User } from '@sensenet/default-content-types'

/**
 * Typeguard for user. let typescript know that the content is a User.
 * @param {GenericContent} content
 * @returns {content is User}
 */
export function isUser(content: GenericContent): content is User {
  return content.Type === 'User'
}

/**
 * Typeguard for user. let typescript know that the content is a User.
 * @param {GenericContent} content
 * @returns {content is User}
 */
// export function isAvatarFieldSettings<T extends FieldSetting>(
//   fieldSetting: T,
//   name: string,
// ): fieldSetting is ReactAvatarFieldSetting {
//   return fieldSetting.Type === 'NullFieldSetting' && name === 'Avatar'
// }
