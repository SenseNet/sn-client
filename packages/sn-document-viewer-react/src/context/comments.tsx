import { CommentData } from '@sensenet/client-core'
import { Trace } from '@sensenet/client-utils'
import React, { useEffect, useState } from 'react'
import { useDocumentData, useDocumentViewerApi, useViewerState } from '../hooks'
import { DocumentViewerApiSettings } from '../models'

export type CommentsContextType = {
  comments: CommentData[]
} & DocumentViewerApiSettings['commentActions']

export const defaultCommentsContext: CommentsContextType = {
  comments: [],
  addPreviewComment: async () => undefined as any,
  deletePreviewComment: async () => undefined as any,
  getPreviewComments: async () => undefined as any,
}

export const CommentsContext = React.createContext<CommentsContextType>(defaultCommentsContext)

export interface CommentContextProviderProps {
  images: 'preview' | 'thumbnail'
}

export const CommentsContextProvider: React.FC<CommentContextProviderProps> = (props) => {
  const api = useDocumentViewerApi()
  const { documentData } = useDocumentData()
  const viewerState = useViewerState()
  const [comments, setComments] = useState<CommentData[]>([])
  useEffect(() => {
    const abortController = new AbortController()
    ;(async () => {
      if (viewerState.showComments && props.images === 'preview') {
        const result = await api.commentActions.getPreviewComments({
          document: documentData,
          page: viewerState.activePage,
          abortController,
        })
        setComments(result)
      }
    })()
    return () => abortController.abort()
  }, [api.commentActions, documentData, props.images, viewerState.activePage, viewerState.showComments])

  useEffect(() => {
    const disposables = [
      Trace.method({
        object: api.commentActions,
        isAsync: true,
        methodName: 'addPreviewComment',
        method: api.commentActions.addPreviewComment,
        onFinished: async ({ returned }) => {
          const a = await returned
          setComments([...comments, a])
          viewerState.updateState({ isPlacingCommentMarker: false })
        },
      }),
      Trace.method({
        object: api.commentActions,
        method: api.commentActions.deletePreviewComment,
        methodName: 'deletePreviewComment',
        isAsync: true,
        onFinished: async ({ returned, methodArguments }) => {
          const returnedValue = await returned
          if (returnedValue.modified) {
            setComments(comments.filter((c) => c.id !== methodArguments[0].commentId))
          }
        },
      }),
    ]

    return () => disposables.forEach((d) => d.dispose())
  }, [api.commentActions, comments, viewerState])

  return (
    <CommentsContext.Provider
      value={{
        ...api.commentActions,
        comments,
      }}>
      {props.children}
    </CommentsContext.Provider>
  )
}
