import { Reducer } from 'redux'
import { IInjectableActionCallbackParams } from 'redux-di-middleware'
import { RootReducerType } from '.'
import { Comment, CommentWithoutCreatedByAndId, DocumentViewerSettings } from '../models'

// tslint:disable: completed-docs
export interface CommentsState {
  items: Comment[]
  selectedCommentId: string
}

export const SET_SELECTED_COMMENT_ID = 'SET_SELECTED_COMMENT_ID'
export const GET_COMMENTS_SUCCESS = 'GET_COMMENTS_SUCCESS'
export const GET_COMMENTS_REQUEST = 'GET_COMMENTS_REQUEST'
export const CREATE_COMMENT_REQUEST = 'CREATE_COMMENT_REQUEST'
export const CREATE_COMMENT_SUCCESS = 'CREATE_COMMENTS_SUCCESS'
export const DELETE_COMMENT_SUCCESS = 'DELETE_COMMENTS_SUCCESS'
export const DELETE_COMMENT_REQUEST = 'DELETE_COMMENT_REQUEST'

export const getCommentsSuccess = (comments: Comment[]) => ({
  type: GET_COMMENTS_SUCCESS,
  comments,
})

export const createCommentSuccess = (comment: Comment) => ({
  type: CREATE_COMMENT_SUCCESS,
  comment,
})

export const deleteCommentSuccess = (id: string) => ({
  type: DELETE_COMMENT_SUCCESS,
  id,
})

export const getComments = () => ({
  type: GET_COMMENTS_REQUEST,
  inject: async (options: IInjectableActionCallbackParams<RootReducerType>) => {
    const api = options.getInjectable(DocumentViewerSettings)
    const comments = await api.commentActions.getPreviewComments(
      options.getState().sensenetDocumentViewer.documentState.document,
      options.getState().sensenetDocumentViewer.viewer.activePages[0],
    )
    options.dispatch(getCommentsSuccess(comments))
    if (comments.length) {
      options.dispatch(showComments(true))
    }
  },
})

export const createComment = (comment: CommentWithoutCreatedByAndId) => ({
  type: CREATE_COMMENT_REQUEST,
  inject: async (options: IInjectableActionCallbackParams<RootReducerType>) => {
    const api = options.getInjectable(DocumentViewerSettings)
    const result = await api.commentActions.addPreviewComment(
      options.getState().sensenetDocumentViewer.documentState.document,
      comment,
    )
    options.dispatch(createCommentSuccess(result))
  },
})

export const deleteComment = (id: string) => ({
  type: DELETE_COMMENT_REQUEST,
  inject: async (options: IInjectableActionCallbackParams<RootReducerType>) => {
    const api = options.getInjectable(DocumentViewerSettings)
    const result = await api.commentActions.deletePreviewComment(
      options.getState().sensenetDocumentViewer.documentState.document,
      id,
    )
    result.modified && options.dispatch(deleteCommentSuccess(id))
  },
})

export function setSelectedCommentId(id: string) {
  return {
    type: SET_SELECTED_COMMENT_ID,
    id,
  }
}

export const commentsDefaultState: CommentsState = {
  selectedCommentId: '',
  items: [],
}

/**
 * Reducer method for the comments state
 */
export const commentsStateReducer: Reducer<CommentsState> = (state = commentsDefaultState, action) => {
  switch (action.type) {
    case SET_SELECTED_COMMENT_ID:
      return { ...state, selectedCommentId: action.id }
    case GET_COMMENTS_SUCCESS:
      return {
        ...state,
        items: action.comments,
      }
    case CREATE_COMMENT_SUCCESS:
      return {
        ...state,
        items: [...state.items, action.comment],
      }
    case DELETE_COMMENT_SUCCESS:
      return {
        ...state,
        items: state.items.filter(comment => comment.id !== action.id),
      }
    default:
      return state
  }
}
