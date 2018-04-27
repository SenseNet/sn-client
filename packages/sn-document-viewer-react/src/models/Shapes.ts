/**
 * Model definition for a Shape instance
 */
export interface Shape {
    /**
     * Shape height
     */
    h: number
    /**
     * Shape width
     */
    w: number

    /**
     * Shape X coordinate
     */
    x: number

    /**
     * Shape y coordinate
     */
    y: number

    /**
     * Index of the page that the Shape belongs to
     */
    imageIndex: number
    /**
     * Unique ID (can be generated on the fly, will be used as a React list key)
     */
    guid: string
}

/**
 * Model definition for a Redaction shape
 */
export type Redaction = Shape

/**
 * Model definition for a Highlight shape
 */
export type Highlight = Shape

/**
 * Model definition for an Annotation shape
 */
export interface Annotation extends Shape {
    index: number
    lineHeight: number,
    text: string,
    fontBold: string,
    fontColor: string,
    fontFamily: string,
    fontItalic: string,
    fontSize: string
}

/**
 * Model definition for a document's shape collection
 */
export interface Shapes {
    redactions: Redaction[]
    highlights: Highlight[]
    annotations: Annotation[]
}
