import type { File } from '@sensenet/default-content-types'

type RepoFileLinkItem = Pick<File, 'DisplayName' | 'Path' | 'Size'>

export const normalizeRepositoryFileUrl = (url?: string) => {
  return (url ?? '')
    .replace(/^(?:\.\.\/)+Root(?=\/|$)/, '/Root')
    .replace(/^Root(?=\/|$)/, '/Root')
}

export const createRepoFileDownloadMarkup = (item: RepoFileLinkItem) => {
  const size = item.Size ? `(${(item.Size / 1024).toFixed(0)} KB)` : ''
  const href = normalizeRepositoryFileUrl(item.Path)

  return `<div class="download">
          <div>${item.DisplayName}</div>
          <a href="${href}" target="_blank" rel="noopener">Download</a> ${size}
          </div>
          <p>&nbsp;</p>`
}
