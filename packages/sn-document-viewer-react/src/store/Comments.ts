import { Reducer } from 'redux'

/**
 * Comments state
 */
export interface CommentsState {
  selectedCommentId: string
}

// use this once https://github.com/reduxjs/redux-starter-kit/issues/125 fixed
// /**
//  * Comments store
//  */
// export const comments = createSlice<CommentsState>({
//   slice: 'comments',
//   initialState: {
//     selectedCommentId: '',
//   },
//   reducers: {
//     setSelectedCommentId: (state, action: PayloadAction<string>) => {
//       state.selectedCommentId = action.payload
//     },
//   },
// })

/**
 * Set selected comment id action type
 */
export const SET_SELECTED_COMMENT_ID = 'SET_SELECTED_COMMENT_ID'

/**
 * Action creator for setting the selected comment id
 */
export function setSelectedCommentId(id: string) {
  return {
    type: SET_SELECTED_COMMENT_ID,
    id,
  }
}

/**
 * The default state data for the Comments
 */
export const defaultState: CommentsState = {
  selectedCommentId: '',
}

/**
 * Reducer method for the comments state
 */
export const commentsStateReducer: Reducer<CommentsState> = (state = defaultState, action) => {
  switch (action.type) {
    case SET_SELECTED_COMMENT_ID:
      return { ...state, selectedCommentId: action.id }

    default:
      return state
  }
}
