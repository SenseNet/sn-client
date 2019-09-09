import { Reducer } from 'redux'
import { IInjectableActionCallbackParams } from 'redux-di-middleware'
import { Comment, CommentWithoutCreatedByAndId, DocumentViewerApiSettings } from '../models'
import { showComments } from './Viewer'
import { RootReducerType } from '.'

export interface CommentsState {
  items: Comment[]
  selectedCommentId: string
  isCreateCommentActive: boolean
  isPlacingCommentMarker: boolean
}

export const SET_SELECTED_COMMENT_ID = 'SET_SELECTED_COMMENT_ID'
export const GET_COMMENTS_SUCCESS = 'GET_COMMENTS_SUCCESS'
export const GET_COMMENTS_REQUEST = 'GET_COMMENTS_REQUEST'
export const CREATE_COMMENT_REQUEST = 'CREATE_COMMENT_REQUEST'
export const CREATE_COMMENT_SUCCESS = 'CREATE_COMMENTS_SUCCESS'
export const DELETE_COMMENT_SUCCESS = 'DELETE_COMMENTS_SUCCESS'
export const DELETE_COMMENT_REQUEST = 'DELETE_COMMENT_REQUEST'
export const TOGGLE_IS_CREATE_COMMENT_ACTIVE = 'TOGGLE_IS_CREATE_COMMENT_ACTIVE'
export const TOGGLE_IS_PLACING_COMMENT_MARKER = 'TOGGLE_IS_PLACING_COMMENT_MARKER'

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
    const api = options.getInjectable<DocumentViewerApiSettings>({} as any)
    const comments = await api.commentActions.getPreviewComments({
      document: options.getState().sensenetDocumentViewer.documentState.document,
      page: options.getState().sensenetDocumentViewer.viewer.activePages[0],
      abortController: new AbortController(),
    })
    options.dispatch(getCommentsSuccess(comments))
    if (comments.length) {
      options.dispatch(showComments(true))
    }
  },
})

export const createComment = (comment: CommentWithoutCreatedByAndId) => ({
  type: CREATE_COMMENT_REQUEST,
  inject: async (options: IInjectableActionCallbackParams<RootReducerType>) => {
    const api = options.getInjectable<any>({} as any)
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
    const api = options.getInjectable<any>({} as any)
    const result = await api.commentActions.deletePreviewComment(
      options.getState().sensenetDocumentViewer.documentState.document,
      id,
    )
    result.modified && options.dispatch(deleteCommentSuccess(id))
  },
})

/**
 * Set selected comment id action
 */
export function setSelectedCommentId(id: string) {
  return {
    type: SET_SELECTED_COMMENT_ID,
    id,
  }
}

/**
 * Toggle isCreateCommentActive action
 */
export function toggleIsCreateCommentActive(isActive: boolean) {
  return {
    type: TOGGLE_IS_CREATE_COMMENT_ACTIVE,
    isActive,
  }
}

/**
 * Toggle isPlacingCommentMarker action
 */
export function toggleIsPlacingCommentMarker(isPlacing: boolean) {
  return {
    type: TOGGLE_IS_PLACING_COMMENT_MARKER,
    isPlacing,
  }
}

export const commentsDefaultState: CommentsState = {
  selectedCommentId: '',
  items: [],
  isCreateCommentActive: false,
  isPlacingCommentMarker: false,
}

/**
 * Reducer method for the comments state
 */
export const commentsStateReducer: Reducer<CommentsState> = (state = commentsDefaultState, action) => {
  switch (action.type) {
    case SET_SELECTED_COMMENT_ID:
      return { ...state, selectedCommentId: action.id }
    case TOGGLE_IS_CREATE_COMMENT_ACTIVE: {
      return { ...state, isCreateCommentActive: action.isActive }
    }
    case TOGGLE_IS_PLACING_COMMENT_MARKER: {
      return { ...state, isPlacingCommentMarker: action.isPlacing }
    }
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
