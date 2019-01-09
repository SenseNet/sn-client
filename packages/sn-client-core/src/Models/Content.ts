/**
 * Interface that represents a sensenet Content
 */
export interface Content {
  /**
   * Unique identifier
   */
  Id: number
  /**
   * Full Content path
   */
  Path: string
  /**
   * Content Name
   */
  Name: string
  /**
   * Type of the content
   */
  Type: string
}
