import React, { useState } from 'react'
import { DraftCommentMarker } from '../models'

export const CommentStateContext = React.createContext<{
  draft?: DraftCommentMarker
  setDraft: (d?: DraftCommentMarker) => void
  activeCommentId?: string
  setActiveComment: (commentId?: string) => void
}>({
  setDraft: () => undefined,
  activeCommentId: undefined,
  setActiveComment: () => undefined,
})

export const CommentStateProvider: React.FC = ({ children }) => {
  const [draft, setDraft] = useState<DraftCommentMarker | undefined>(undefined)
  const [activeCommentId, setActiveComment] = useState<string | undefined>(undefined)

  return (
    <CommentStateContext.Provider value={{ draft, setDraft, activeCommentId, setActiveComment }}>
      {children}
    </CommentStateContext.Provider>
  )
}
