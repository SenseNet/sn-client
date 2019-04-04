import { sleepAsync } from '@sensenet/client-utils'
import {
  commentsDefaultState,
  commentsStateReducer,
  CREATE_COMMENT_REQUEST,
  CREATE_COMMENT_SUCCESS,
  createComment,
  createCommentSuccess,
  DELETE_COMMENT_REQUEST,
  DELETE_COMMENT_SUCCESS,
  deleteComment,
  deleteCommentSuccess,
  GET_COMMENTS_REQUEST,
  GET_COMMENTS_SUCCESS,
  getComments,
  getCommentsSuccess,
  SET_SELECTED_COMMENT_ID,
  setSelectedCommentId,
} from '../src/store/Comments'
import { defaultState } from '../src/store/Document'
import { examplePreviewComment } from './__Mocks__/viewercontext'

const mockDispatch = jest.fn()
const options = {
  dispatch: mockDispatch,
  getInjectable: () => {
    return {
      commentActions: {
        addPreviewComment: () => examplePreviewComment,
        deletePreviewComment: () => {
          return { modified: true }
        },
        getPreviewComments: () => [examplePreviewComment],
      },
    }
  },
  getState: () => {
    return {
      sensenetDocumentViewer: {
        documentState: defaultState,
        viewer: {
          activePages: [1],
        },
      },
    }
  },
}
describe('comments reducer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return the initial state', () => {
    expect(commentsStateReducer(undefined, { type: '' })).toEqual({ selectedCommentId: '', items: [] })
  })

  it(`should handle ${SET_SELECTED_COMMENT_ID}`, () => {
    expect(commentsStateReducer(undefined, setSelectedCommentId('anId'))).toEqual({
      selectedCommentId: 'anId',
      items: [],
    })
  })

  it(`should handle ${CREATE_COMMENT_SUCCESS}`, () => {
    expect(commentsStateReducer(undefined, createCommentSuccess(examplePreviewComment)).items).toEqual([
      examplePreviewComment,
    ])
    expect(commentsStateReducer(undefined, createCommentSuccess(examplePreviewComment))).not.toEqual(
      commentsDefaultState,
    )
  })

  it(`should handle ${DELETE_COMMENT_SUCCESS}`, () => {
    const state = { items: [{ id: 'id' }] } as any
    expect(commentsStateReducer(state, deleteCommentSuccess('id')).items).toEqual([])
    expect(commentsStateReducer(state, deleteCommentSuccess('id'))).not.toEqual(state)
  })

  it(`should handle ${GET_COMMENTS_SUCCESS}`, () => {
    expect(commentsStateReducer(undefined, getCommentsSuccess([examplePreviewComment])).items).toEqual([
      examplePreviewComment,
    ])
    expect(commentsStateReducer(undefined, getCommentsSuccess([examplePreviewComment]))).not.toEqual(
      commentsDefaultState,
    )
  })

  it(`should handle ${CREATE_COMMENT_REQUEST}`, async () => {
    createComment(examplePreviewComment).inject(options as any)
    await sleepAsync()
    expect(mockDispatch).toBeCalledTimes(1)
    expect(mockDispatch).toBeCalledWith({ type: CREATE_COMMENT_SUCCESS, comment: examplePreviewComment })
  })

  it(`should handle ${DELETE_COMMENT_REQUEST}`, async () => {
    deleteComment('id').inject(options as any)
    await sleepAsync()
    expect(mockDispatch).toBeCalledTimes(1)
    expect(mockDispatch).toBeCalledWith({ type: DELETE_COMMENT_SUCCESS, id: 'id' })
  })

  it(`should handle ${GET_COMMENTS_REQUEST}`, async () => {
    getComments().inject(options as any)
    await sleepAsync()
    expect(mockDispatch).toBeCalledTimes(1)
    expect(mockDispatch).toBeCalledWith({ type: GET_COMMENTS_SUCCESS, comments: [examplePreviewComment] })
  })
})
