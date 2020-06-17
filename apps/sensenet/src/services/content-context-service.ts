import { Repository } from '@sensenet/client-core'
import { ActionModel, ContentType, File, GenericContent, Resource, Settings } from '@sensenet/default-content-types'
import { PATHS, resolvePathParams } from '../application-paths'
import { pathWithQueryParams } from '.'

export function getMonacoLanguage(content: GenericContent, repository: Repository) {
  if (repository.schemas.isContentFromType<Settings>(content, 'Settings') || content.Type === 'PersonalSettings') {
    return 'json'
  }
  if (
    repository.schemas.isContentFromType<ContentType>(content, 'ContentType') ||
    repository.schemas.isContentFromType<Resource>(content, 'Resource')
  ) {
    return 'xml'
  }
  if (repository.schemas.isContentFromType<File>(content, 'File')) {
    if (content.Binary) {
      switch (content.Binary.__mediaresource.content_type) {
        case 'application/x-javascript':
          return 'javascript'
        case 'text/css':
          return 'css'
        case 'text/html':
          return 'html'
        case 'text/xml':
          return 'xml'
        case 'application/octet-stream':
          if (content.Name.endsWith('.json')) {
            return 'json'
          } else if (content.Name.endsWith('.ts') || content.Name.endsWith('.tsx')) {
            return 'typescript'
          } else if (content.Name.endsWith('.js') || content.Name.endsWith('.jsx')) {
            return 'javascript'
          } else if (content.Name.endsWith('.md')) {
            return 'markdown'
          }
          break
        default:
          return ''
      }
    }
  }
  return ''
}
export function getPrimaryActionUrl(content: GenericContent, repository: Repository, editInpage = false) {
  if (content.Type === 'PersonalSettings') {
    return PATHS.personalSettings.appPath
  }

  if (content.IsFolder) {
    return pathWithQueryParams({
      path: resolvePathParams({
        path: PATHS.content.appPath,
        params: { browseType: 'explorer' },
      }),
      newParams: { path: content.Path },
    })
  }

  if (getMonacoLanguage(content, repository)) {
    return resolvePathParams({ path: PATHS.editBinary.appPath, params: { contentId: content.Id } })
  }

  if (
    (content as any).Binary &&
    (content as any).Binary.__mediaresource.content_type !== 'application/x-javascript' &&
    (content as any).Binary.__mediaresource.content_type !== 'text/css' &&
    (content as any).Binary.__mediaresource.content_type !== 'text/xml'
  ) {
    return resolvePathParams({ path: PATHS.preview.appPath, params: { contentId: content.Id } })
  }

  if (
    content.Actions &&
    (content.Actions as any[]).length > 0 &&
    (content.Actions as ActionModel[]).find((a) => a.Name === 'WopiOpenEdit')
  ) {
    return resolvePathParams({
      path: PATHS.wopi.appPath,
      params: { action: 'edit', contentId: content.Id.toString() },
    })
  }

  if (
    content.Actions &&
    (content.Actions as any[]).length > 0 &&
    (content.Actions as ActionModel[]).find((a) => a.Name === 'WopiOpenView')
  ) {
    return resolvePathParams({
      path: PATHS.wopi.appPath,
      params: { action: 'view', contentId: content.Id.toString() },
    })
  }

  if (editInpage) {
    return 'openEdit'
  }

  return resolvePathParams({ path: PATHS.editProperties.appPath, params: { contentId: content.Id } })
}
