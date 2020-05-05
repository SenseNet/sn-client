import { CommentData, DocumentData, PreviewImageData } from '@sensenet/client-core'
import { DocumentViewerApiSettings } from '../../src/models'

/**
 * Example document data for document viewer context
 */
export const exampleDocumentData: DocumentData = {
  documentName: 'example doc',
  hostName: 'https://example-host',
  documentType: 'word',
  idOrPath: 'example/id/or/path',
  shapes: {
    annotations: [
      {
        index: 1,
        h: 100,
        w: 100,
        x: 10,
        y: 10,
        text: 'Example Text',
        guid: '9a324f30-1423-11e9-bcb9-d719ddfb5f43',
        lineHeight: 15,
        fontBold: '34',
        imageIndex: 1,
        fontColor: 'red',
        fontFamily: 'arial',
        fontItalic: 'false',
        fontSize: '12pt',
      },
    ],
    highlights: [
      {
        guid: '9a324f30-1423-11e9-bcb9-d719ddfb5f43',
        imageIndex: 1,
        h: 100,
        w: 100,
        x: 100,
        y: 100,
      },
    ],
    redactions: [
      {
        guid: '9a324f30-1423-11e9-bcb9-d719ddfb5f43',
        imageIndex: 1,
        h: 100,
        w: 100,
        x: 200,
        y: 200,
      },
    ],
  },
  fileSizekB: 128,
  pageAttributes: [
    {
      options: {
        degree: 3,
      },
      pageNum: 1,
    },
  ],
  pageCount: 1,
}

/**
 * Example preview image data for document viewer context
 */
export const examplePreviewImageData: PreviewImageData = {
  Attributes: {
    degree: 0,
  },
  Height: 1024,
  Width: 768,
  Index: 1,
  PreviewImageUrl: '/',
  ThumbnailImageUrl: '/',
}

/**
 * Example preview comment
 */
export const examplePreviewComment: CommentData = {
  createdBy: {
    avatarUrl: 'https://cdn.images.express.co.uk/img/dynamic/79/590x/486693_1.jpg',
    displayName: 'Alba',
    id: 1,
    path: 'some/path',
    userName: 'some/name',
  },
  id: 'someId',
  page: 1,
  text: 'Thats a comment',
  x: '10',
  y: '10',
}

/**
 * Default settings for document viewer context
 */
export const defaultSettings: DocumentViewerApiSettings = {
  regeneratePreviews: async () => {
    /** */
  },
  canEditDocument: async () => true,
  canHideRedaction: async () => true,
  canHideWatermark: async () => true,
  getDocumentData: async () => exampleDocumentData,
  getExistingPreviewImages: async () => [examplePreviewImageData],
  isPreviewAvailable: async () => examplePreviewImageData,
  saveChanges: async () => undefined,
  commentActions: {
    addPreviewComment: async () => examplePreviewComment,
    deletePreviewComment: async () => {
      return { modified: true }
    },
    getPreviewComments: async () => [examplePreviewComment],
  },
}
