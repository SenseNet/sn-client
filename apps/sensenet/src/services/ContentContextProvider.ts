import { Injectable } from '@furystack/inject'
import { Repository } from '@sensenet/client-core'
import { SchemaStore } from '@sensenet/client-core/dist/Schemas/SchemaStore'
import { ContentType, File as SnFile, GenericContent, Resource, Settings } from '@sensenet/default-content-types'
import { Uri } from 'monaco-editor'
import { isContentFromType } from '../utils/isContentFromType'

@Injectable()
export class ContentContextProvider {
  public getMonacoModelUri(content: GenericContent) {
    if (isContentFromType(content, Settings)) {
      return Uri.parse(`sensenet://${content.Type}/${content.Name}`)
    }
    if (isContentFromType(content, SnFile)) {
      if (content.Binary) {
        return Uri.parse(`sensenet://${content.Type}/${content.Binary.__mediaresource.content_type}`)
      }
    }
    return Uri.parse(`sensenet://${content.Type}`)
  }

  public getMonacoLanguage(content: GenericContent, schemas: SchemaStore) {
    if (isContentFromType(content, Settings, schemas)) {
      return 'json'
    }
    if (isContentFromType(content, ContentType, schemas) || isContentFromType(content, Resource, schemas)) {
      return 'xml'
    }
    if (isContentFromType(content, SnFile, schemas)) {
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
        }
      }
    }
    return ''
  }

  public canEditBinary(content: GenericContent, schemas: SchemaStore) {
    return this.getMonacoLanguage(content, schemas) ? true : false
  }

  public getPrimaryActionUrl<T extends GenericContent>(content: T, repo: Repository) {
    const repoSegment = btoa(repo.configuration.repositoryUrl)
    if (content.IsFolder) {
      return `/${repoSegment}/content/${content.Id}`
    }
    if (
      (content as any).Binary &&
      (content as any).Binary.__mediaresource.content_type !== 'application/x-javascript' &&
      (content as any).Binary.__mediaresource.content_type !== 'text/css'
    ) {
      return `/${repoSegment}/preview/${content.Id}`
    }
    if (this.canEditBinary(content, repo.schemas)) {
      return `/${repoSegment}/editBinary/${content.Id}`
    }
    return `/${repoSegment}/editProperties/${content.Id}`
  }
}
