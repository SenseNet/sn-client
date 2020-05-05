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
export interface CommentData {
  id: string
  createdBy: CreatedByUser
  page: number
  x: string
  y: string
  text: string
}

/**
 * Comment object without the created by User
 */
export type CommentWithoutCreatedByAndId = Omit<CommentData, 'createdBy' | 'id'>

/**
 * Coordinates for marker
 */
export type DraftCommentMarker = Pick<CommentData, 'x' | 'y' | 'id'>
