import { Repository } from '../src/Repository/Repository'
import { Preview } from '../src/Repository/Preview'

describe('Preview', () => {
  let preview: Preview
  let repository: Repository

  beforeEach(() => {
    repository = new Repository({}, async () => ({ ok: true, json: async () => ({}), text: async () => '' } as any))
    preview = new Preview(repository)
  })

  afterEach(() => {
    repository.dispose()
  })

  it('Should execute regenerate', () => {
    expect(preview.regenerate({ idOrPath: 1 })).toBeInstanceOf(Promise)
  })

  it('Should execute getPageCount', () => {
    expect(preview.getPageCount({ idOrPath: 1 })).toBeInstanceOf(Promise)
  })

  it('Should execute check', () => {
    expect(preview.check({ idOrPath: 1, generateMissing: true })).toBeInstanceOf(Promise)
  })

  describe('Comment operators', () => {
    it('Should execute addComment', () => {
      expect(
        preview.addComment({ idOrPath: 1, comment: { page: 1, x: '1', y: '1', text: 'Test comment' } }),
      ).toBeInstanceOf(Promise)
    })

    it('Should execute getComments', () => {
      expect(preview.getComments({ idOrPath: 1, page: 1 })).toBeInstanceOf(Promise)
    })

    it('Should execute deleteComment', () => {
      expect(preview.deleteComment({ idOrPath: 1, commentId: '40' })).toBeInstanceOf(Promise)
    })
  })
})
