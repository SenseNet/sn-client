import { useContext } from 'react'
import { CommentsContext } from '../context/comments'

export const useComments = () => useContext(CommentsContext)
