import { useContext } from 'react'
import { CommentDraftContext } from '../context/comment-draft'

export const useCommentDraft = () => useContext(CommentDraftContext)
