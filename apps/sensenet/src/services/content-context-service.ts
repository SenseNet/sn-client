import { Repository } from '@sensenet/client-core'
import { ActionModel, ContentType, File, GenericContent, Resource, Settings } from '@sensenet/default-content-types'
import { applicationPaths } from '../application-paths'

export class ContentContextService {
  public getMonacoLanguage(content: GenericContent) {
    if (
      this.repository.schemas.isContentFromType<Settings>(content, 'Settings') ||
      content.Type === 'PersonalSettings'
    ) {
      return 'json'
    }
    if (
      this.repository.schemas.isContentFromType<ContentType>(content, 'ContentType') ||
      this.repository.schemas.isContentFromType<Resource>(content, 'Resource')
    ) {
      return 'xml'
    }
    if (this.repository.schemas.isContentFromType<File>(content, 'File')) {
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

  public getPrimaryActionUrl(content: GenericContent) {
    if (content.Type === 'PersonalSettings') {
      return applicationPaths.personalSettings
    }

    if (content.IsFolder) {
      return 'Browse'
    }

    if (this.getMonacoLanguage(content)) {
      return `${applicationPaths.editBinary}/${content.Id}`
    }

    if (
      (content as any).Binary &&
      (content as any).Binary.__mediaresource.content_type !== 'application/x-javascript' &&
      (content as any).Binary.__mediaresource.content_type !== 'text/css' &&
      (content as any).Binary.__mediaresource.content_type !== 'text/xml'
    ) {
      return `${applicationPaths.preview}/${content.Id}`
    }

    if (
      content.Actions &&
      (content.Actions as any[]).length > 0 &&
      (content.Actions as ActionModel[]).find((a) => a.Name === 'WopiOpenEdit')
    ) {
      return `${applicationPaths.wopi}/${content.Id}/edit`
    }

    if (
      content.Actions &&
      (content.Actions as any[]).length > 0 &&
      (content.Actions as ActionModel[]).find((a) => a.Name === 'WopiOpenView')
    ) {
      return `${applicationPaths.wopi}/${content.Id}/read`
    }

    return `${applicationPaths.editProperties}/${content.Id}`
  }

  constructor(private readonly repository: Repository) {}
}
