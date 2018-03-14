/**
 * Defines an upload progress info data model
 */
export interface IUploadProgressInfo<T> {
    /**
     * Basic info about the created Content
     */
    createdContent: T;
    /**
     * Total chunks count
     */
    chunkCount: number;
    /**
     * Uploaded chunks
     */
    uploadedChunks: number;
    /**
     * Flag that indicates if the upload has been completed
     */
    completed: boolean;
}
