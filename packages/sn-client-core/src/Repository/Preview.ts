import {
  CommentData,
  CommentWithoutCreatedByAndId,
  DocumentData,
  PreviewImageData,
  PreviewRegenerateData,
} from '../Models'
import { Repository } from './Repository'

export class Preview {
  public regenerate(options: { idOrPath: number | string; abortController?: AbortController }) {
    return this.repository.executeAction<any, PreviewRegenerateData>({
      name: 'RegeneratePreviews',
      idOrPath: options.idOrPath,
      method: 'POST',
      body: undefined,
      requestInit: {
        signal: options.abortController?.signal,
      },
    })
  }

  public async available(options: {
    document: DocumentData
    version: string
    page: number
    abortController?: AbortController
  }) {
    const responseBody = await this.repository.executeAction<{ page: number }, PreviewImageData>({
      idOrPath: options.document.idOrPath,
      method: 'POST',
      name: `PreviewAvailable?version=${options.version}`,
      body: {
        page: options.page,
      } as any,
      requestInit: {
        signal: options.abortController?.signal,
      },
    })

    if (responseBody.PreviewAvailable) {
      responseBody.PreviewImageUrl = `${options.document.hostName}${responseBody.PreviewAvailable}`
      responseBody.ThumbnailImageUrl = `${options.document.hostName}${responseBody.PreviewAvailable.replace(
        'preview',
        'thumbnail',
      )}`
      return responseBody as PreviewImageData
    }
  }

  public async getExistingImages(options: {
    document: DocumentData
    version: string
    abortController?: AbortController
  }) {
    if (options.document.pageCount < -1) {
      throw Error('Preview generation error')
    }

    const response = await this.repository.executeAction({
      idOrPath: options.document.idOrPath,
      name: `GetExistingPreviewImages`,
      method: 'POST',
      body: {},
      oDataOptions: {
        select: 'all',
        expand: 'all',
        version: options.version,
      } as any,
      requestInit: {
        signal: options.abortController?.signal,
      },
    })

    const availablePreviews = (response as PreviewImageData[]).map((preview) => {
      if (preview.PreviewAvailable) {
        preview.PreviewImageUrl = `${options.document.hostName}${preview.PreviewAvailable}`
        preview.ThumbnailImageUrl = `${options.document.hostName}${preview.PreviewAvailable.replace(
          'preview',
          'thumbnail',
        )}`
      }
      return preview
    })

    const allPreviews: PreviewImageData[] = []
    for (let i = 0; i < options.document.pageCount; i++) {
      allPreviews[i] = availablePreviews[i] || ({ Index: i + 1 } as any)
      const pageAttributes = options.document.pageAttributes.find((p) => p.pageNum === allPreviews[i].Index)
      allPreviews[i].Attributes = pageAttributes && pageAttributes.options
    }
    return allPreviews
  }

  public getPageCount(options: { idOrPath: number | string; abortController?: AbortController }): Promise<number> {
    return this.repository.executeAction({
      idOrPath: options.idOrPath,
      name: 'GetPageCount',
      method: 'POST',
      requestInit: {
        signal: options.abortController?.signal,
      },
    })
  }

  public check(options: {
    idOrPath: number | string
    generateMissing?: boolean
    abortController?: AbortController
  }): Promise<number> {
    return this.repository.executeAction({
      idOrPath: options.idOrPath,
      name: 'CheckPreviews',
      method: 'POST',
      body: {
        generateMissing: options.generateMissing,
      },
      requestInit: {
        signal: options.abortController?.signal,
      },
    })
  }

  public getComments(options: { idOrPath: number | string; page: number; abortController?: AbortController }) {
    return this.repository.executeAction<any, CommentData[]>({
      idOrPath: options.idOrPath,
      name: 'GetPreviewComments',
      method: 'GET',
      oDataOptions: {
        page: options.page,
      } as any,
      requestInit: {
        signal: options.abortController?.signal,
      },
    })
  }

  public addComment(options: {
    idOrPath: number | string
    comment: CommentWithoutCreatedByAndId
    abortController?: AbortController
  }) {
    return this.repository.executeAction<CommentWithoutCreatedByAndId, CommentData>({
      idOrPath: options.idOrPath,
      name: 'AddPreviewComment',
      method: 'POST',
      body: options.comment,
      requestInit: {
        signal: options.abortController?.signal,
      },
    })
  }

  public deleteComment(options: { idOrPath: number | string; commentId: string; abortController?: AbortController }) {
    return this.repository.executeAction<any, { modified: boolean }>({
      idOrPath: options.idOrPath,
      name: 'DeletePreviewComment',
      method: 'POST',
      body: {
        id: options.commentId,
      },
      requestInit: {
        signal: options.abortController?.signal,
      },
    })
  }

  constructor(private readonly repository: Repository) {}
}
