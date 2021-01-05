import { Shapes } from '.'

/**
 * Generic document properties
 */
export interface DocumentData {
  hostName: string
  idOrPath: number | string
  documentName: string
  documentType: string
  fileSizekB: number
  shapes: Shapes
  pageCount: number
  error?: string
}
