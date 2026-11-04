import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from './use-repository'

export const downloadFile = (
  fileName: string,
  repositorPath: string,
  repositoryUrl: string,
  token: string | undefined,
) => {
  const url = `${repositoryUrl}${repositorPath}?download&t=${Date.now()}`
  fetch(url, {
    method: 'get',
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  })
    .then((response) => response.blob())
    .then((blob) => {
      const urlInner = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = urlInner
      link.download = fileName || 'downloaded-file'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    })
    .catch((error) => {
      console.error('Error fetching the file:', error)
    })
}
/**
 * Custom hook that downloads a specified content from a repository
 * Has to be wrapped with **RepositoryContext**
 */
export const useDownload = (content: GenericContent) => {
  const repo = useRepository()
  const isFile = repo.schemas.isContentFromType(content, 'File')
  return {
    /**
     * Boolean that indicates if the content is a File
     */
    isFile,

    /**
     * Callback that will trigger the download
     */
    download: () =>
      downloadFile(content.Name, content.Path, repo.configuration.repositoryUrl, repo.configuration.token),
  }
}
