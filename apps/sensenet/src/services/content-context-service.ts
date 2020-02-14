import { Repository } from '@sensenet/client-core'
import { ActionModel, ContentType, File, GenericContent, Resource, Settings } from '@sensenet/default-content-types'
import { encodeBrowseData } from '../components/content'

export type RouteType =
  | 'Browse'
  | 'EditProperties'
  | 'EditBinary'
  | 'Preview'
  | 'PersonalSettings'
  | 'WopiEdit'
  | 'WopiRead'

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

  public canEditBinary(content: GenericContent) {
    return this.getMonacoLanguage(content) ? true : false
  }
  public getPrimaryActionRouteType<T extends GenericContent>(content: T): RouteType {
    if (content.Type === 'PersonalSettings') {
      return 'PersonalSettings'
    }

    if (content.IsFolder) {
      return 'Browse'
    }
    if (this.canEditBinary(content)) {
      return 'EditBinary'
    }
    if (
      (content as any).Binary &&
      (content as any).Binary.__mediaresource.content_type !== 'application/x-javascript' &&
      (content as any).Binary.__mediaresource.content_type !== 'text/css' &&
      (content as any).Binary.__mediaresource.content_type !== 'text/xml'
    ) {
      return 'Preview'
    }

    if (
      content.Actions &&
      (content.Actions as any[]).length > 0 &&
      (content.Actions as ActionModel[]).find(a => a.Name === 'WopiOpenEdit')
    ) {
      return 'WopiEdit'
    }

    if (
      content.Actions &&
      (content.Actions as any[]).length > 0 &&
      (content.Actions as ActionModel[]).find(a => a.Name === 'WopiOpenView')
    ) {
      return 'WopiRead'
    }

    return 'EditProperties'
  }

  public getActionUrl<T extends GenericContent>(content: T, routeType: RouteType) {
    const repoSegment = btoa(this.repository.configuration.repositoryUrl)

    if (routeType.startsWith('Wopi')) {
      return `/${repoSegment}/wopi/${content.Id}/${routeType === 'WopiEdit' ? 'edit' : 'read'}`
    }

    if (routeType === 'Browse') {
      return `/${repoSegment}/${routeType}/${encodeBrowseData({ currentContent: content.Id })}`
    }
    return `/${repoSegment}/${routeType}/${content.Id}`
  }
  public getPrimaryActionUrl<T extends GenericContent>(content: T) {
    const routeType = this.getPrimaryActionRouteType(content)
    if (routeType === 'PersonalSettings') {
      return '/personalSettings'
    }
    return this.getActionUrl(content, routeType)
  }

  constructor(private readonly repository: Repository) {}
}
