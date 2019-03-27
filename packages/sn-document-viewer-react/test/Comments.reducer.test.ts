import { commentsStateReducer, SET_SELECTED_COMMENT_ID, setSelectedCommentId } from '../src/store/Comments'

describe('comments reducer', () => {
  it('should return the initial state', () => {
    expect(commentsStateReducer(undefined, { type: '' })).toEqual({ selectedCommentId: '', items: [] })
  })

  it(`should handle ${SET_SELECTED_COMMENT_ID}`, () => {
    expect(commentsStateReducer(undefined, setSelectedCommentId('anId'))).toEqual({
      selectedCommentId: 'anId',
      items: [],
    })
  })
})
