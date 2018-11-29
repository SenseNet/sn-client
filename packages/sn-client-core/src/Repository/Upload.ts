import { PathHelper } from '@sensenet/client-utils'
import { v1 } from 'uuid'
import { Content } from '../Models/Content'
import {
  UploadFileOptions,
  UploadFromEventOptions,
  UploadFromFileListOptions,
  UploadOptions,
  UploadTextOptions,
} from '../Models/RequestOptions'
import { Repository } from '../Repository/Repository'

import { WebKitDirectoryEntry, WebKitFileEntry } from './WebkitTypes'

/**
 * Response model for Uploads
 */
export interface UploadResponse {
  /**
   * Identifier for the uploaded content
   */
  Id: number
  /**
   * Uploaded file lengthj
   */
  Length: number
  /**
   * Content name
   */
  Name: string
  /**
   * URL for thumbnail view
   */
  Thumbnail_url: string
  /**
   * Created content type
   */
  Type: string
  /**
   * Url for the created content
   */
  Url: string
}

/**
 * Helper class for uploading content into the sensenet Repository
 */
export class Upload {
  /**
   * Uploads a specified text as a binary file
   * @param {UploadTextOptions} options The additional options
   */
  public static async textAsFile<T extends Content>(options: UploadTextOptions<T>): Promise<UploadResponse> {
    const uploadFileOptions = Object.assign(
      { file: new File([options.text], options.fileName) },
      options,
    ) as UploadFileOptions<T>
    return await this.file(uploadFileOptions)
  }

  /**
   * Uploads a specified file into a sensenet Repository
   * @param {UploadFileOptions} options The additional upload options
   */
  public static async file<T extends Content>(options: UploadFileOptions<T>): Promise<UploadResponse> {
    if (this.isChunkedUploadNeeded(options.file, options.repository)) {
      return await this.uploadChunked(options)
    }
    return await this.uploadNonChunked(options)
  }

  /**
   * Returns if a chunked upload is needed for a specified file
   * @param {File} file The File object
   * @param {Repository} repo The sensenet Repository
   */
  public static isChunkedUploadNeeded(file: File, repo: Repository): boolean {
    return file.size >= repo.configuration.chunkSize
  }

  private static getUploadUrl(options: UploadFileOptions<any>) {
    return PathHelper.joinPaths(
      options.repository.configuration.repositoryUrl,
      options.repository.configuration.oDataToken,
      PathHelper.getContentUrl(options.parentPath),
      'upload',
    )
  }

  private static getFormDataFromOptions(options: UploadFileOptions<any>) {
    const formData = new FormData()
    formData.append('ChunkToken', '0*0*False*False')
    formData.append('FileName', options.file.name)
    formData.append('Overwrite', options.overwrite.toString())
    formData.append('PropertyName', options.binaryPropertyName.toString())
    formData.append('FileLength', options.file.size.toString())
    formData.append('ContentType', options.contentTypeName.toString())
    return formData
  }

  private static async uploadNonChunked<T>(options: UploadFileOptions<T>): Promise<UploadResponse> {
    const guid = v1()

    options.progressObservable &&
      options.progressObservable.setValue({
        guid,
        file: options.file,
        completed: false,
      })

    const formData = this.getFormDataFromOptions(options)
    formData.append(options.file.name, options.file)
    const response = await options.repository.fetch(this.getUploadUrl(options), {
      credentials: 'include',
      method: 'POST',
      body: formData,
    })
    if (!response.ok) {
      const error = response.json()
      options.progressObservable &&
        options.progressObservable.setValue({
          guid,
          file: options.file,
          chunkCount: 1,
          uploadedChunks: 1,
          completed: true,
          createdContent: options.progressObservable.getValue().createdContent,
          error,
        })
      throw await options.repository.getErrorFromResponse(response)
    }

    const uploadResponse: UploadResponse = await response.json()

    options.progressObservable &&
      options.progressObservable.setValue({
        guid,
        file: options.file,
        chunkCount: 1,
        uploadedChunks: 1,
        completed: true,
        createdContent: uploadResponse,
      })
    return uploadResponse
  }

  private static async uploadChunked<T>(options: UploadFileOptions<T>) {
    const chunkCount = Math.floor(options.file.size / options.repository.configuration.chunkSize)

    const guid = v1()

    options.progressObservable &&
      options.progressObservable.setValue({
        guid,
        file: options.file,
        completed: false,
        chunkCount,
        uploadedChunks: 0,
      })

    const uploadPath = this.getUploadUrl(options)

    /** initial chunk data and request */
    const formData = this.getFormDataFromOptions(options)
    formData.append(options.file.name, options.file.slice(0, options.repository.configuration.chunkSize))
    formData.append('UseChunk', 'true')
    formData.append('create', '1')
    const initRequest = await options.repository.fetch(uploadPath, {
      body: formData,
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Range': `bytes 0-${options.repository.configuration.chunkSize - 1}/${options.file.size}`,
        'Content-Disposition': `attachment; filename="${options.file.name}"`,
      },
    })

    if (!initRequest.ok) {
      throw await options.repository.getErrorFromResponse(initRequest)
    }

    const chunkToken = await initRequest.text()
    let lastResponseContent: UploadResponse = {} as any

    for (let i = 0; i <= chunkCount; i++) {
      const start = i * options.repository.configuration.chunkSize
      let end = start + options.repository.configuration.chunkSize
      end = end > options.file.size ? options.file.size : end

      const chunkFormData = new FormData()
      const chunkData = options.file.slice(start, end)

      chunkFormData.append('FileLength', options.file.size.toString())
      chunkFormData.append('ChunkToken', chunkToken)
      chunkFormData.append(options.file.name, chunkData)

      const lastResponse = await options.repository.fetch(uploadPath, {
        body: chunkFormData,
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Range': `bytes ${start}-${end - 1}/${options.file.size}`,
          'Content-Disposition': `attachment; filename="${options.file.name}"`,
        },
      })
      if (lastResponse.ok) {
        lastResponseContent = await lastResponse.json()
        options.progressObservable &&
          options.progressObservable.setValue({
            guid,
            file: options.file,
            chunkCount,
            uploadedChunks: i,
            completed: i === chunkCount,
            createdContent: lastResponseContent,
          })
      } else {
        const error = await lastResponse.json()
        options.progressObservable &&
          options.progressObservable.setValue({
            guid,
            file: options.file,
            chunkCount,
            uploadedChunks: i,
            completed: i === chunkCount,
            createdContent: lastResponseContent,
            error,
          })
        throw await options.repository.getErrorFromResponse(lastResponse)
      }
    }

    return lastResponseContent
  }

  private static async webkitFileHandler<T extends Content>(
    fileEntry: WebKitFileEntry,
    contentPath: string,
    options: UploadOptions<T>,
  ) {
    await new Promise((resolve, reject) => {
      fileEntry.file(
        async f => {
          await this.file({
            file: (f as any) as File,
            ...options,
            parentPath: contentPath,
          })
          resolve()
        },
        err => reject(err),
      )
    })
  }

  private static async webkitDirectoryHandler<T extends Content>(
    directory: WebKitDirectoryEntry,
    contentPath: string,
    options: UploadOptions<T>,
    readEntries: boolean = true,
  ) {
    const folder = await options.repository.post({
      content: {
        Name: directory.name,
      },
      parentPath: contentPath,
      contentType: 'Folder',
    })
    if (readEntries) {
      const dirReader = directory.createReader()
      await new Promise((resolve, reject) => {
        dirReader.readEntries(
          async items => {
            await this.webkitItemListHandler<T>(items as any, folder.d.Path, true, options)
            resolve()
          },
          err => reject(err),
        )
      })
    }
  }

  private static async webkitItemListHandler<T extends Content>(
    items: Array<WebKitFileEntry | WebKitDirectoryEntry>,
    contentPath: string,
    createFolders: boolean,
    options: UploadOptions<T>,
  ) {
    // tslint:disable-next-line:forin
    for (const item of items) {
      if (createFolders && item.isDirectory) {
        await this.webkitDirectoryHandler(item as WebKitDirectoryEntry, contentPath, options)
      }
      if (item.isFile) {
        await this.webkitFileHandler(item as WebKitFileEntry, contentPath, options)
      }
    }
  }

  /**
   * Uploads content from a specified Drop Event
   * @param { UploadOptions } options Options for the Upload request
   */
  public static async fromDropEvent<T extends Content = Content>(options: UploadFromEventOptions<T>) {
    if ((window as any).webkitRequestFileSystem) {
      const entries: Array<WebKitFileEntry | WebKitDirectoryEntry> =
        options.event.dataTransfer &&
        [].map.call(options.event.dataTransfer.items, (i: DataTransferItem) => i.webkitGetAsEntry())

      await this.webkitItemListHandler<T>(entries, options.parentPath, options.createFolders, options)
    } else {
      // Fallback for non-webkit browsers.
      options.event.dataTransfer &&
        [].forEach.call(options.event.dataTransfer.files, async (f: File) => {
          if (f.type === 'file') {
            return await Upload.file({
              file: f,
              ...(options as UploadOptions<T>),
            })
          }
        })
    }
  }

  /**
   * Uploads files (and optionally creates the directory structure) from a file list
   * @param { UploadFromFileListOptions } options Options for the Upload request
   */
  public static async fromFileList<T extends Content = Content>(options: UploadFromFileListOptions<T>) {
    if (options.createFolders) {
      const directories = new Set(
        Array.from(options.fileList).map(f => PathHelper.getParentPath((f as any).webkitRelativePath)),
      )
      const directoriesBySegments = Array.from(directories).map(d => PathHelper.getSegments(d))
      const createdDirectories = new Set<string>()
      for (const directory of directoriesBySegments) {
        let currentPath = options.parentPath
        for (const segment of directory) {
          const pathToCreate = PathHelper.joinPaths(currentPath, segment)
          if (!createdDirectories.has(pathToCreate)) {
            await this.webkitDirectoryHandler(
              { name: segment } as WebKitDirectoryEntry,
              currentPath,
              options as UploadOptions<T>,
              false,
            )
          }
          createdDirectories.add(pathToCreate)
          currentPath = pathToCreate
        }
      }

      await Promise.all(
        Array.from(options.fileList).map(async file => {
          await this.file({
            ...(options as UploadOptions<T>),
            parentPath: PathHelper.joinPaths(
              options.parentPath,
              PathHelper.getParentPath((file as any).webkitRelativePath),
            ),
            file,
          })
        }),
      )
    } else {
      const { fileList, createFolders, ...uploadOptions } = options
      for (const file of Array.from(options.fileList)) {
        await this.file({
          ...uploadOptions,
          file,
        })
      }
    }
  }
}
