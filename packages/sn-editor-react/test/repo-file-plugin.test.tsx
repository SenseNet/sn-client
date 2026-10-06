import {
  createRepoFileDownloadMarkup,
  normalizeRepositoryFileUrl,
} from '../src/tinymce/controls/repo-file-plugin.utils'

describe('repo file plugin utils', () => {
  it('should normalize repository file urls to root-relative paths', () => {
    expect(normalizeRepositoryFileUrl('../Root/Content/file.pdf')).toBe('/Root/Content/file.pdf')
    expect(normalizeRepositoryFileUrl('../../Root/Content/file.pdf')).toBe('/Root/Content/file.pdf')
    expect(normalizeRepositoryFileUrl('Root/Content/file.pdf')).toBe('/Root/Content/file.pdf')
    expect(normalizeRepositoryFileUrl('/Root/Content/file.pdf')).toBe('/Root/Content/file.pdf')
  })

  it('should create download markup with a normalized repository href', () => {
    const markup = createRepoFileDownloadMarkup({
      DisplayName: 'file.pdf',
      Path: '../Root/Content/file.pdf',
      Size: 2048,
    })

    expect(markup).toContain(
      '<a href="/Root/Content/file.pdf" target="_blank" rel="noopener">Download</a> (2 KB)',
    )
  })
})
