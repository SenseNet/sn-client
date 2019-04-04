import { Repository } from '@sensenet/client-core'
import { ContentType, File as SnFile, GenericContent, Resource, Settings } from '@sensenet/default-content-types'
import { isContentFromType } from '../utils/isContentFromType'

export type RouteType = 'Browse' | 'EditProperties' | 'EditBinary' | 'Preview'

export class ContentContextProvider {
  public getMonacoLanguage(content: GenericContent) {
    if (isContentFromType(content, Settings, this.repository.schemas)) {
      return 'json'
    }
    if (
      isContentFromType(content, ContentType, this.repository.schemas) ||
      isContentFromType(content, Resource, this.repository.schemas)
    ) {
      return 'xml'
    }
    if (isContentFromType(content, SnFile, this.repository.schemas)) {
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
        }
      }
    }
    return ''
  }

  public canEditBinary(content: GenericContent) {
    return this.getMonacoLanguage(content) ? true : false
  }
  public getPrimaryActionRouteType<T extends GenericContent>(content: T): RouteType {
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
    return 'EditProperties'
  }

  public getActionUrl<T extends GenericContent>(content: T, routeType: RouteType) {
    const repoSegment = btoa(this.repository.configuration.repositoryUrl)
    return `/${repoSegment}/${routeType}/${content.Id}`
  }
  public getPrimaryActionUrl<T extends GenericContent>(content: T) {
    const routeType = this.getPrimaryActionRouteType(content)
    return this.getActionUrl(content, routeType)
  }

  constructor(private readonly repository: Repository) {}
}
