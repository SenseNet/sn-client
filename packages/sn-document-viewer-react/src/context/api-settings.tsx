import React, { useEffect, useState } from 'react'
import { useRepository } from '@sensenet/hooks-react'
import { File as SnFile } from '@sensenet/default-content-types'
import { deepMerge, toNumber } from '@sensenet/client-utils'
import { v1 } from 'uuid'
import { Annotation, CommentData, DocumentData, Highlight, Redaction, Repository, Shape } from '@sensenet/client-core'
import { DocumentViewerApiSettings } from '../models'

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
 */
function changeCreatedByUrlToCurrent(documentData: DocumentData): (value: CommentData) => CommentData {
  return (comment) => {
    return {
      ...comment,
      createdBy: { ...comment.createdBy, avatarUrl: `${documentData.hostName}${comment.createdBy.avatarUrl}` },
    }
  }
}

export const DocumentViewerApiSettingsContext = React.createContext<DocumentViewerApiSettings>({
  canEditDocument: async () => false,
  canHideRedaction: async () => false,
  canHideWatermark: async () => false,
  commentActions: {
    addPreviewComment: async ({ comment }) => ({ ...comment } as any),
    deletePreviewComment: async () => ({ modified: false }),
    getPreviewComments: async () => [],
  },
  getDocumentData: async () => ({
    documentName: 'example',
    documentType: '',
    fileSizekB: 3,
    hostName: '',
    idOrPath: 1,
    pageAttributes: [],
    pageCount: 0,
    shapes: { annotations: [], highlights: [], redactions: [] },
  }),
  getExistingPreviewImages: async () => [],
  isPreviewAvailable: async () => ({ Height: 0, Width: 0, Index: 0, Attributes: { degree: 0 } }),
  regeneratePreviews: async () => undefined,
  saveChanges: async () => undefined,
})

export const createDefaultApiSettings: (repo: Repository) => DocumentViewerApiSettings = (repo: Repository) => ({
  regeneratePreviews: async ({ document, abortController }) => {
    repo.preview.regenerate({ idOrPath: document.idOrPath, abortController })
  },
  saveChanges: async ({ document, pages, abortController }) => {
    const reqBody = {
      Shapes: JSON.stringify([
        { redactions: document.shapes.redactions },
        { highlights: document.shapes.highlights },
        { annotations: document.shapes.annotations },
      ]),
      PageAttributes: JSON.stringify(
        pages
          .map((p) => (p.Attributes && p.Attributes.degree && { pageNum: p.Index, options: p.Attributes }) || undefined)
          .filter((p) => p !== undefined),
      ),
    }
    await repo.patch<SnFile>({
      idOrPath: document.idOrPath,
      content: reqBody,
      requestInit: {
        signal: abortController.signal,
      },
    })
  },
  getDocumentData: async (settings) => {
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
        redactions: (JSON.parse(documentData.Shapes)[0].redactions as Redaction[]).map((a) => addGuidToShape(a)) || [],
        annotations:
          (JSON.parse(documentData.Shapes)[2].annotations as Annotation[]).map((a) => addGuidToShape(a)) || [],
        highlights: (JSON.parse(documentData.Shapes)[1].highlights as Highlight[]).map((a) => addGuidToShape(a)) || [],
      }) || {
        redactions: [],
        annotations: [],
        highlights: [],
      },
      pageAttributes: (documentData.PageAttributes && JSON.parse(documentData.PageAttributes)) || [],
    }
  },
  isPreviewAvailable: async ({ document, version, page, abortController }) => {
    return await repo.preview.available({ document, version, page, abortController })
  },
  canEditDocument: async ({ document, abortController }) => {
    const response = await repo.security.hasPermission(document.idOrPath, ['Save'], undefined, {
      signal: abortController.signal,
      credentials: 'include',
    })
    return response
  },
  canHideRedaction: async ({ document, abortController }) =>
    await repo.security.hasPermission(document.idOrPath, ['PreviewWithoutRedaction'], undefined, {
      signal: abortController.signal,
      credentials: 'include',
    }),
  canHideWatermark: async ({ document, abortController }) =>
    await repo.security.hasPermission(document.idOrPath, ['PreviewWithoutWatermark'], undefined, {
      signal: abortController.signal,
      credentials: 'include',
    }),
  getExistingPreviewImages: async ({ document, version, abortController }) => {
    return await repo.preview.getExisting({ document, version, abortController })
  },
  commentActions: {
    addPreviewComment: async ({ document, comment, abortController }) => {
      const response = await repo.preview.addComment({ idOrPath: document.idOrPath, comment, abortController })
      return [response].map(changeCreatedByUrlToCurrent(document))[0]
    },
    deletePreviewComment: async ({ document, commentId, abortController }) => {
      return await repo.preview.deleteComment({ idOrPath: document.idOrPath, commentId, abortController })
    },
    getPreviewComments: async ({ document, page, abortController }) => {
      const response = await repo.preview.getComments({ idOrPath: document.idOrPath, page, abortController })
      return response.map(changeCreatedByUrlToCurrent(document))
    },
  },
})

export const DocumentViewerApiSettingsProvider: React.FC<{ options?: Partial<DocumentViewerApiSettings> }> = ({
  children,
  options,
}) => {
  const repo = useRepository()
  const [settings, setSettings] = useState(deepMerge(createDefaultApiSettings(repo), options))
  useEffect(() => {
    setSettings(deepMerge(createDefaultApiSettings(repo), options))
  }, [repo, options])

  return (
    <DocumentViewerApiSettingsContext.Provider value={settings}>{children}</DocumentViewerApiSettingsContext.Provider>
  )
}
