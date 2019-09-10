import React, { useEffect, useState } from 'react'
import { useDocumentData, useDocumentViewerApi } from '../hooks'
import { CommentData } from '../models/Comment'
import { DocumentViewerApiSettings } from '../models'

export const CommentsContext = React.createContext<
  {
    comments: CommentData[]
  } & DocumentViewerApiSettings['commentActions']
>({
  comments: [],
  addPreviewComment: async () => undefined as any,
  deletePreviewComment: async () => undefined as any,
  getPreviewComments: async () => undefined as any,
})

export const CommentsContextProvider: React.FC<{ page: number }> = ({ page, children }) => {
  const api = useDocumentViewerApi()
  const document = useDocumentData()
  const [comments, setComments] = useState<CommentData[]>([])

  useEffect(() => {
    const abortController = new AbortController()
    ;(async () => {
      /** */
      const result = await api.commentActions.getPreviewComments({ document, page, abortController })
      setComments(result)
    })()
    return () => abortController.abort()
  }, [api.commentActions, document, page])

  return <CommentsContext.Provider value={{ ...api.commentActions, comments }}>{children}</CommentsContext.Provider>
}
