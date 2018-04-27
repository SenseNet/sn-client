/**
 * PageAttribute model
 */
export interface PageAttribute {
    /**
     * The index of the page
     */
    pageNum: number,

    /**
     * Options for the current page
     */
    options: {

        /**
         * Rotation in degrees
         */
        degree: number,
    }
}
