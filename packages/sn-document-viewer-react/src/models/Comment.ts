/**
 * User properties who created the comment
 */
export interface CreatedByUser {
  id: number
  path: string
  userName: string
  displayName: string
  avatarUrl: string
}

/**
 * Comment object
 */
export interface Comment {
  id: string
  createdBy: CreatedByUser
  page: number
  x: number
  y: number
  text: string
}

/**
 * Comment object without the created by User
 */
export type CommentWithoutCreatedBy = Pick<Comment, Exclude<keyof Comment, 'createdBy'>>
