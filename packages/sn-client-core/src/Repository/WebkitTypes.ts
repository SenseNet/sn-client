export interface WebKitFileSystem {
  readonly name: string
  readonly root: WebKitDirectoryEntry
}

export type WebKitEntriesCallback = ((entries: WebKitEntry[]) => void) | { handleEvent(entries: WebKitEntry[]): void }

export type WebKitErrorCallback = ((err: DOMError) => void) | { handleEvent(err: DOMError): void }

export type WebKitFileCallback = ((file: File) => void) | { handleEvent(file: File): void }

export interface WebKitFileEntry extends WebKitEntry {
  file(successCallback: WebKitFileCallback, errorCallback?: WebKitErrorCallback): void
}

export interface WebKitDirectoryEntry extends WebKitEntry {
  createReader(): WebKitDirectoryReader
}

export interface WebKitDirectoryReader {
  readEntries(successCallback: WebKitEntriesCallback, errorCallback?: WebKitErrorCallback): void
}

export interface WebKitEntry {
  readonly filesystem: WebKitFileSystem
  readonly fullPath: string
  readonly isDirectory: boolean
  readonly isFile: boolean
  readonly name: string
}
