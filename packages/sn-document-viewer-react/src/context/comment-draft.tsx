import React, { useState } from 'react'
import { DraftCommentMarker } from '../models'

export const CommentDraftContext = React.createContext<{
  draft?: DraftCommentMarker
  setDraft: (d?: DraftCommentMarker) => void
}>({
  setDraft: () => undefined,
})

export const CommentDraftProvider: React.FC = ({ children }) => {
  const [draft, setDraft] = useState<DraftCommentMarker | undefined>(undefined)

  return <CommentDraftContext.Provider value={{ draft, setDraft }}> {children}</CommentDraftContext.Provider>
}
