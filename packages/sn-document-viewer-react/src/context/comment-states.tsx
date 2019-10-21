import React, { useState } from 'react'
import { DraftCommentMarker } from '../models'

export interface CommentState {
  draft?: DraftCommentMarker
  setDraft: (d?: DraftCommentMarker) => void
  activeCommentId?: string
  setActiveComment: (commentId?: string) => void
}

export const defaultCommentState: CommentState = {
  setDraft: () => undefined,
  activeCommentId: undefined,
  setActiveComment: () => undefined,
}

export const CommentStateContext = React.createContext<CommentState>(defaultCommentState)

export const CommentStateProvider: React.FC = ({ children }) => {
  const [draft, setDraft] = useState<DraftCommentMarker>()
  const [activeCommentId, setActiveComment] = useState<string>()

  return (
    <CommentStateContext.Provider value={{ draft, setDraft, activeCommentId, setActiveComment }}>
      {children}
    </CommentStateContext.Provider>
  )
}
