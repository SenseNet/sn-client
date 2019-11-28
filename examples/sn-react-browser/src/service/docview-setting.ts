import {
  Annotation,
  Comment,
  CommentWithoutCreatedByAndId,
  DocumentData,
  DocumentViewerSettings,
  Highlight,
  PreviewImageData,
  Redaction,
  Shape,
} from '@sensenet/document-viewer-react'
import { File as SnFile } from '@sensenet/default-content-types'
import { Repository } from '@sensenet/client-core'
import { toNumber } from '@sensenet/client-utils'
import { v1 } from 'uuid'

/**
 * Adds a globally unique ID to the shape
 */
const addGuidToShape = <T extends Shape>(shape: T) => {
  shape.guid = v1()
  return shape
}

/**
 * Concatenates avatar url with host
 * @param {DocumentData} documentData
 * @returns {(value: Comment) => Comment}
 */
function changeCreatedByUrlToCurrent(documentData: DocumentData): (value: Comment) => Comment {
  return comment => {
    return {
      ...comment,
      createdBy: { ...comment.createdBy, avatarUrl: `${documentData.hostName}${comment.createdBy.avatarUrl}` },
    }
  }
}

export const getViewerSettings = (repo: Repository) =>
  new DocumentViewerSettings({
    regeneratePreviews: async documentData => {
      repo.executeAction({
        idOrPath: documentData.idOrPath,
        method: 'POST',
        body: undefined,
        name: 'RegeneratePreviews',
      })
    },
    saveChanges: async (documentData, pages) => {
      const reqBody = {
        Shapes: JSON.stringify([
          { redactions: documentData.shapes.redactions },
          { highlights: documentData.shapes.highlights },
          { annotations: documentData.shapes.annotations },
        ]),
        PageAttributes: JSON.stringify(
          pages
            .map(p => (p.Attributes && p.Attributes.degree && { pageNum: p.Index, options: p.Attributes }) || undefined)
            .filter(p => p !== undefined),
        ),
      }
      await repo.patch<SnFile>({
        idOrPath: documentData.idOrPath,
        content: reqBody,
      })
    },
    getDocumentData: async settings => {
      const documentData = (
        await repo.load<SnFile>({
          idOrPath: settings.idOrPath,
          oDataOptions: {
            select: 'all',
          },
        })
      ).d
      return {
        idOrPath: settings.idOrPath,
        hostName: repo.configuration.repositoryUrl,
        fileSizekB: documentData.Size as number,
        pageCount: toNumber(documentData.PageCount, -1)!,
        documentName: documentData.DisplayName || '',
        documentType: documentData.Type || 'File',
        shapes: (documentData.Shapes && {
          redactions: (JSON.parse(documentData.Shapes)[0].redactions as Redaction[]).map(a => addGuidToShape(a)) || [],
          annotations:
            (JSON.parse(documentData.Shapes)[2].annotations as Annotation[]).map(a => addGuidToShape(a)) || [],
          highlights: (JSON.parse(documentData.Shapes)[1].highlights as Highlight[]).map(a => addGuidToShape(a)) || [],
        }) || {
          redactions: [],
          annotations: [],
          highlights: [],
        },
        pageAttributes: (documentData.PageAttributes && JSON.parse(documentData.PageAttributes)) || [],
      }
    },
    isPreviewAvailable: async (documentData, version, page) => {
      const responseBody = await repo.executeAction<{ page: number }, PreviewImageData & { PreviewAvailable: string }>({
        idOrPath: documentData.idOrPath,
        method: 'POST',
        name: `PreviewAvailable?version=${version}`,
        body: {
          page,
        },
      })
      if (responseBody.PreviewAvailable) {
        responseBody.PreviewImageUrl = `${documentData.hostName}${responseBody.PreviewAvailable}`
        responseBody.ThumbnailImageUrl = `${documentData.hostName}${responseBody.PreviewAvailable.replace(
          'preview',
          'thumbnail',
        )}`
        return responseBody as PreviewImageData
      }
    },
    canEditDocument: async settings => {
      const response = await repo.security.hasPermission(settings.idOrPath, ['Save'], undefined)
      return response
    },
    canHideRedaction: async settings =>
      await repo.security.hasPermission(settings.idOrPath, ['PreviewWithoutRedaction']),
    canHideWatermark: async settings =>
      await repo.security.hasPermission(settings.idOrPath, ['PreviewWithoutWatermark']),
    getExistingPreviewImages: async (settings, version) => {
      if (settings.pageCount < -1) {
        throw Error('Preview generation error')
      }

      const response = await repo.executeAction({
        idOrPath: settings.idOrPath,
        name: `GetExistingPreviewImages`,
        method: 'POST',
        body: {},
        oDataOptions: {
          select: 'all',
          expand: 'all',
          version,
        } as any,
      })

      const availablePreviews = ((await response) as Array<PreviewImageData & { PreviewAvailable?: string }>).map(a => {
        if (a.PreviewAvailable) {
          a.PreviewImageUrl = `${settings.hostName}${a.PreviewAvailable}`
          a.ThumbnailImageUrl = `${settings.hostName}${a.PreviewAvailable.replace('preview', 'thumbnail')}`
        }
        return a
      })

      const allPreviews: PreviewImageData[] = []
      for (let i = 0; i < settings.pageCount; i++) {
        allPreviews[i] = availablePreviews[i] || ({ Index: i + 1 } as any)
        const pageAttributes = settings.pageAttributes.find(p => p.pageNum === allPreviews[i].Index)
        allPreviews[i].Attributes = pageAttributes && pageAttributes.options
      }
      return allPreviews
    },
    commentActions: {
      addPreviewComment: async (documentData, comment) => {
        const response = await repo.executeAction<CommentWithoutCreatedByAndId, Comment>({
          idOrPath: documentData.idOrPath,
          body: comment,
          name: 'AddPreviewComment',
          method: 'POST',
        })
        return [response].map(changeCreatedByUrlToCurrent(documentData))[0]
      },
      deletePreviewComment: async (documentData, id) => {
        const response = await repo.executeAction<any, { modified: boolean }>({
          idOrPath: documentData.idOrPath,
          body: { id },
          name: 'DeletePreviewComment',
          method: 'POST',
        })
        return response
      },
      getPreviewComments: async (documentData, page) => {
        const response = await repo.executeAction<any, Comment[]>({
          idOrPath: documentData.idOrPath,
          name: 'GetPreviewComments',
          method: 'GET',
          oDataOptions: {
            page,
          } as any,
        })
        return response.map(changeCreatedByUrlToCurrent(documentData))
      },
    },
  })
