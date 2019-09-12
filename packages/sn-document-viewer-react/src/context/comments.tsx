import React, { useEffect, useState } from 'react'
import { Trace } from '@sensenet/client-utils'
import { useDocumentData, useDocumentViewerApi } from '../hooks'
import { CommentData } from '../models/Comment'
import { DocumentViewerApiSettings } from '../models'

export const CommentsContext = React.createContext<
  {
    comments: CommentData[]
    activeCommentId?: string
    setActiveComment: (commentId?: string) => void
  } & DocumentViewerApiSettings['commentActions']
>({
  comments: [],
  activeCommentId: undefined,
  setActiveComment: () => undefined,
  addPreviewComment: async () => undefined as any,
  deletePreviewComment: async () => undefined as any,
  getPreviewComments: async () => undefined as any,
})

export const CommentsContextProvider: React.FC<{ page: number }> = ({ page, children }) => {
  const api = useDocumentViewerApi()
  const document = useDocumentData()
  const [comments, setComments] = useState<CommentData[]>([])
  const [activeCommentId, setActiveComment] = useState<string | undefined>(undefined)
  useEffect(() => {
    const abortController = new AbortController()
    ;(async () => {
      /** */
      const result = await api.commentActions.getPreviewComments({ document, page, abortController })
      setComments(result)
    })()
    return () => abortController.abort()
  }, [api.commentActions, document, page])

  useEffect(() => {
    const disposables = [
      Trace.method({
        object: api.commentActions,
        isAsync: true,
        method: api.commentActions.addPreviewComment,
        onFinished: async ({ returned }) => {
          const a = await returned
          setComments([...comments, a])
        },
      }),
      Trace.method({
        object: api.commentActions,
        method: api.commentActions.deletePreviewComment,
        isAsync: true,
        onFinished: async ({ returned, methodArguments }) => {
          const returnedValue = await returned
          if (returnedValue.modified) {
            setComments(comments.filter(c => c.id !== methodArguments[0].commentId))
          }
        },
      }),
    ]

    return () => disposables.forEach(d => d.dispose())
  }, [api.commentActions, comments])

  return (
    <CommentsContext.Provider
      value={{
        ...api.commentActions,
        comments,
        activeCommentId,
        setActiveComment,
      }}>
      {children}
    </CommentsContext.Provider>
  )
}
