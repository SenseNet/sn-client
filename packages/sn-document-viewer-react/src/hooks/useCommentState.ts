import { useContext } from 'react'
import { CommentStateContext } from '../context/comment-states'

export const useCommentState = () => useContext(CommentStateContext)
