import { File, GenericContent } from '@sensenet/default-content-types'
import { useRepository } from './use-repository'

export const fakeClick = (obj: EventTarget) => {
  const ev = document.createEvent('MouseEvents')
  ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
  obj.dispatchEvent(ev)
}

export const downloadFile = (name: string, repositoryUrl: string) => {
  const saveLink = document.createElement('a')
  saveLink.href = `${repositoryUrl}${name}?download`
  fakeClick(saveLink)
}

/**
 * Custom hook that downloads a specified content from a repository
 * Has to be wrapped with **RepositoryContext**
 */
export const useDownload = (content: GenericContent) => {
  const repo = useRepository()
  const isFile = repo.schemas.isContentFromType(content, File)
  return {
    /**
     * Boolean that indicates if the content is a File
     */
    isFile,

    /**
     * Callback that will trigger the download
     */
    download: () => downloadFile(content.Path, repo.configuration.repositoryUrl),
  }
}
