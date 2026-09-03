import type { Repository } from '@sensenet/client-core'
import type { GenericContent } from '@sensenet/default-content-types'

type ZipEntry = {
  path: string
  data: Uint8Array
  date: Date
  isDirectory: boolean
}

type DownloadableContent = {
  content: GenericContent
  zipPath: string
}

export type ZipDownloadResult = {
  fileCount: number
  folderCount: number
  skippedContentCount: number
  fileName: string
}

type ZipDownloadOptions = {
  repository: Repository
  contents: GenericContent[]
  parent?: GenericContent
}

const contentLoadBatchSize = 200
const fileDownloadBatchSize = 4
const zipUtf8Flag = 0x0800
const zipVersionNeeded = 20
const textEncoder = new TextEncoder()
const invalidZipPathCharacters = new Set(['\\', '/', ':', '*', '?', '"', '<', '>', '|'])

const crc32Table = (() => {
  const table = new Uint32Array(256)

  for (let index = 0; index < table.length; index++) {
    let value = index

    for (let bit = 0; bit < 8; bit++) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
    }

    table[index] = value >>> 0
  }

  return table
})()

const getCrc32 = (data: Uint8Array) => {
  let crc = 0xffffffff

  for (const byte of data) {
    crc = (crc >>> 8) ^ crc32Table[(crc ^ byte) & 0xff]
  }

  return (crc ^ 0xffffffff) >>> 0
}

const getDosTime = (date: Date) => {
  return (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2)
}

const getDosDate = (date: Date) => {
  return ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()
}

const getContentDate = (content: GenericContent) => {
  const dateValue = content.ModificationDate || content.CreationDate
  const date = dateValue ? new Date(dateValue) : new Date()

  return Number.isNaN(date.getTime()) ? new Date() : date
}

const sanitizeZipPathSegment = (value: string | number | undefined) => {
  const segment = String(value || 'content')
    .split('')
    .map((character) => (invalidZipPathCharacters.has(character) || character.charCodeAt(0) < 32 ? '_' : character))
    .join('')
    .trim()

  return segment || 'content'
}

const getContentZipPathSegment = (content: GenericContent) => {
  return sanitizeZipPathSegment(content.Name || content.DisplayName || content.Id)
}

const addDuplicateSuffix = (zipPath: string, index: number, isDirectory: boolean) => {
  const pathWithoutTrailingSlash = isDirectory ? zipPath.replace(/\/$/, '') : zipPath
  const slashIndex = pathWithoutTrailingSlash.lastIndexOf('/')
  const parentPath = slashIndex >= 0 ? pathWithoutTrailingSlash.slice(0, slashIndex + 1) : ''
  const fileName = slashIndex >= 0 ? pathWithoutTrailingSlash.slice(slashIndex + 1) : pathWithoutTrailingSlash
  const dotIndex = !isDirectory ? fileName.lastIndexOf('.') : -1

  if (dotIndex > 0) {
    return `${parentPath}${fileName.slice(0, dotIndex)}(${index})${fileName.slice(dotIndex)}`
  }

  return `${parentPath}${fileName}(${index})${isDirectory ? '/' : ''}`
}

const reserveUniqueZipPath = (usedZipPaths: Set<string>, zipPath: string, isDirectory: boolean) => {
  const normalizedZipPath = isDirectory ? `${zipPath.replace(/\/$/, '')}/` : zipPath
  let nextZipPath = normalizedZipPath
  let duplicateIndex = 1

  while (usedZipPaths.has(nextZipPath)) {
    nextZipPath = addDuplicateSuffix(normalizedZipPath, duplicateIndex, isDirectory)
    duplicateIndex += 1
  }

  usedZipPaths.add(nextZipPath)

  return nextZipPath
}

const createZipEntry = (path: string, data: Uint8Array, date: Date, isDirectory = false): ZipEntry => ({
  path,
  data,
  date,
  isDirectory,
})

const loadAllChildren = async (repository: Repository, path: string) => {
  const children: GenericContent[] = []
  let skip = 0
  let hasMoreChildren = true

  while (hasMoreChildren) {
    const result = await repository.loadCollection<GenericContent>({
      path,
      oDataOptions: {
        select: ['Id', 'Path', 'Name', 'DisplayName', 'Type', 'IsFile', 'IsFolder', 'CreationDate', 'ModificationDate'],
        top: contentLoadBatchSize,
        skip,
        orderby: 'Name',
      },
    })
    const loadedChildren = result.d.results

    children.push(...loadedChildren)

    hasMoreChildren = loadedChildren.length === contentLoadBatchSize
    skip += contentLoadBatchSize
  }

  return children
}

const loadContentKindFields = async (repository: Repository, content: GenericContent) => {
  if (content.IsFile !== undefined || content.IsFolder !== undefined) {
    return content
  }

  const result = await repository.load<GenericContent>({
    idOrPath: content.Id,
    oDataOptions: {
      select: ['Id', 'Path', 'Name', 'DisplayName', 'Type', 'IsFile', 'IsFolder', 'CreationDate', 'ModificationDate'],
    },
  })

  return { ...content, ...result.d }
}

const fetchFileBytes = async (repository: Repository, content: GenericContent) => {
  const headers = new Headers()

  if (repository.configuration.token) {
    headers.set('Authorization', `Bearer ${repository.configuration.token}`)
  }

  const response = await fetch(
    `${repository.configuration.repositoryUrl}${content.Path}?download&t=${Date.now()}`,
    headers.has('Authorization') ? { headers } : undefined,
  )

  if (!response.ok) {
    throw new Error(`Failed to download ${content.Path}: ${response.status} ${response.statusText}`)
  }

  return new Uint8Array(await response.arrayBuffer())
}

const createLocalFileHeader = (entry: ZipEntry, fileNameBytes: Uint8Array, crc32: number) => {
  const header = new Uint8Array(30 + fileNameBytes.length)
  const view = new DataView(header.buffer)

  view.setUint32(0, 0x04034b50, true)
  view.setUint16(4, zipVersionNeeded, true)
  view.setUint16(6, zipUtf8Flag, true)
  view.setUint16(8, 0, true)
  view.setUint16(10, getDosTime(entry.date), true)
  view.setUint16(12, getDosDate(entry.date), true)
  view.setUint32(14, crc32, true)
  view.setUint32(18, entry.data.length, true)
  view.setUint32(22, entry.data.length, true)
  view.setUint16(26, fileNameBytes.length, true)
  view.setUint16(28, 0, true)
  header.set(fileNameBytes, 30)

  return header
}

const createCentralDirectoryHeader = (
  entry: ZipEntry,
  fileNameBytes: Uint8Array,
  crc32: number,
  localHeaderOffset: number,
) => {
  const header = new Uint8Array(46 + fileNameBytes.length)
  const view = new DataView(header.buffer)

  view.setUint32(0, 0x02014b50, true)
  view.setUint16(4, zipVersionNeeded, true)
  view.setUint16(6, zipVersionNeeded, true)
  view.setUint16(8, zipUtf8Flag, true)
  view.setUint16(10, 0, true)
  view.setUint16(12, getDosTime(entry.date), true)
  view.setUint16(14, getDosDate(entry.date), true)
  view.setUint32(16, crc32, true)
  view.setUint32(20, entry.data.length, true)
  view.setUint32(24, entry.data.length, true)
  view.setUint16(28, fileNameBytes.length, true)
  view.setUint16(30, 0, true)
  view.setUint16(32, 0, true)
  view.setUint16(34, 0, true)
  view.setUint16(36, 0, true)
  view.setUint32(38, entry.isDirectory ? 0x00100000 : 0, true)
  view.setUint32(42, localHeaderOffset, true)
  header.set(fileNameBytes, 46)

  return header
}

const createEndOfCentralDirectory = (
  entryCount: number,
  centralDirectorySize: number,
  centralDirectoryOffset: number,
) => {
  const header = new Uint8Array(22)
  const view = new DataView(header.buffer)

  view.setUint32(0, 0x06054b50, true)
  view.setUint16(4, 0, true)
  view.setUint16(6, 0, true)
  view.setUint16(8, entryCount, true)
  view.setUint16(10, entryCount, true)
  view.setUint32(12, centralDirectorySize, true)
  view.setUint32(16, centralDirectoryOffset, true)
  view.setUint16(20, 0, true)

  return header
}

const createZipBlob = (entries: ZipEntry[]) => {
  if (entries.length > 0xffff) {
    throw new Error('Too many ZIP entries. ZIP64 is not supported by this exporter.')
  }

  const localFileParts: Uint8Array[] = []
  const centralDirectoryParts: Uint8Array[] = []
  let localFileOffset = 0

  entries.forEach((entry) => {
    const fileNameBytes = textEncoder.encode(entry.path)
    const crc32 = getCrc32(entry.data)
    const localFileHeader = createLocalFileHeader(entry, fileNameBytes, crc32)
    const centralDirectoryHeader = createCentralDirectoryHeader(entry, fileNameBytes, crc32, localFileOffset)

    localFileParts.push(localFileHeader, entry.data)
    centralDirectoryParts.push(centralDirectoryHeader)
    localFileOffset += localFileHeader.length + entry.data.length
  })

  const centralDirectoryOffset = localFileOffset
  const centralDirectorySize = centralDirectoryParts.reduce((totalSize, part) => totalSize + part.length, 0)
  const endOfCentralDirectory = createEndOfCentralDirectory(
    entries.length,
    centralDirectorySize,
    centralDirectoryOffset,
  )

  return new Blob([...localFileParts, ...centralDirectoryParts, endOfCentralDirectory], { type: 'application/zip' })
}

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const getZipDownloadFileName = (contents: GenericContent[], parent?: GenericContent) => {
  const parentName = sanitizeZipPathSegment(parent?.Name || 'sensenet-content')
  const timeStamp = new Date().toISOString().replace(/[:.]/g, '-')
  const suffix =
    contents.length === 1 ? sanitizeZipPathSegment(contents[0].Name || contents[0].Id) : `${contents.length}-items`

  return `${parentName}-${suffix}-${timeStamp}.zip`
}

export const downloadContentsAsZip = async ({
  repository,
  contents,
  parent,
}: ZipDownloadOptions): Promise<ZipDownloadResult> => {
  const zipEntries: ZipEntry[] = []
  const filesToDownload: DownloadableContent[] = []
  const visitedContentIds = new Set<number>()
  const usedZipPaths = new Set<string>()
  let folderCount = 0
  let skippedContentCount = 0

  const collectContent = async (content: GenericContent, parentZipPath = ''): Promise<void> => {
    if (visitedContentIds.has(content.Id)) {
      return
    }

    const contentWithKind = await loadContentKindFields(repository, content)

    if (visitedContentIds.has(contentWithKind.Id)) {
      return
    }

    visitedContentIds.add(contentWithKind.Id)

    const zipPath = parentZipPath
      ? `${parentZipPath}/${getContentZipPathSegment(contentWithKind)}`
      : getContentZipPathSegment(contentWithKind)

    if (contentWithKind.IsFolder) {
      const uniqueDirectoryPath = reserveUniqueZipPath(usedZipPaths, zipPath, true)
      zipEntries.push(createZipEntry(uniqueDirectoryPath, new Uint8Array(), getContentDate(contentWithKind), true))
      folderCount += 1

      const children = await loadAllChildren(repository, contentWithKind.Path)

      for (const child of children) {
        await collectContent(child, uniqueDirectoryPath.replace(/\/$/, ''))
      }

      return
    }

    if (contentWithKind.IsFile) {
      filesToDownload.push({
        content: contentWithKind,
        zipPath: reserveUniqueZipPath(usedZipPaths, zipPath, false),
      })

      return
    }

    skippedContentCount += 1
  }

  for (const content of contents) {
    await collectContent(content)
  }

  for (let startIndex = 0; startIndex < filesToDownload.length; startIndex += fileDownloadBatchSize) {
    const batch = filesToDownload.slice(startIndex, startIndex + fileDownloadBatchSize)
    const downloadedFiles = await Promise.all(
      batch.map(async (file) => ({
        file,
        bytes: await fetchFileBytes(repository, file.content),
      })),
    )

    downloadedFiles.forEach(({ file, bytes }) => {
      zipEntries.push(createZipEntry(file.zipPath, bytes, getContentDate(file.content)))
    })
  }

  if (!zipEntries.length) {
    throw new Error('There is no downloadable content in the current selection.')
  }

  const fileName = getZipDownloadFileName(contents, parent)
  const zipBlob = createZipBlob(zipEntries)

  downloadBlob(zipBlob, fileName)

  return {
    fileCount: filesToDownload.length,
    folderCount,
    skippedContentCount,
    fileName,
  }
}
