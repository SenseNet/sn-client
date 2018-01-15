/**
 * Interface that represents a sensenet Content
 */
export interface IContent {
    /**
     * Unique identifier
     */
    Id: number;
    /**
     * Full Content path
     */
    Path: string;
    /**
     * Content Name
     */
    Name: string;
    /**
     * Type of the content
     */
    Type: string;
}
