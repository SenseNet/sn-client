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

declare const WebKitDirectoryEntry: {
  prototype: WebKitDirectoryEntry
  new (): WebKitDirectoryEntry
}

export interface WebKitDirectoryReader {
  readEntries(successCallback: WebKitEntriesCallback, errorCallback?: WebKitErrorCallback): void
}

export declare const WebKitDirectoryReader: {
  prototype: WebKitDirectoryReader
  new (): WebKitDirectoryReader
}

export interface WebKitEntry {
  readonly filesystem: WebKitFileSystem
  readonly fullPath: string
  readonly isDirectory: boolean
  readonly isFile: boolean
  readonly name: string
}

declare const WebKitEntry: {
  prototype: WebKitEntry
  new (): WebKitEntry
}
