/**
 * @module Repository
 */
/** */

import { Content, ODataParams } from "@sensenet/client-core";

/**
 * Model for Content Created event
 */
export interface ICreated {
    /**
     * The created Content instance
     */
    content: Content;
}

/**
 * Model for Content Creation Failed event
 */
export interface ICreateFailed {
    /**
     * The unsaved Content instance
     */
    content: Content;

    /**
     * The Error that caused the failure
     */
    error: any;
}

/**
 * Model for Content Modified event
 */
export interface IModified {
    /**
     * The Content instance that has been modified.
     */
    content: Content;

    /**
     * The Change data
     */
    changes: Content;
}

/**
 * Model for Content Modification Failed event
 */
export interface IModificationFailed {
    /**
     * The Content instance that has been failed to modify
     */
    content: Partial<Content>;
    /**
     * The Error that caused the failure
     */
    error: any;
}

/**
 * Model for Content Loaded event
 */
export interface ILoaded {
    /**
     * The Loaded content instance
     */
    content: Content;
}

/**
 * Model for Content Deleted event
 */
export interface IDeleted {
    /**
     * The Content data that has been deleted
     */
    contentData: Content;
    /**
     * Indicates if the Content was deleted permanently or just moved to Trash
     */
    permanently: boolean;
}

/**
 * Model for Content Delete failed event
 */
export interface IDeleteFailed {
    /**
     * The Content that you've tried to delete
     */
    content: Content;
    /**
     * Indicates if you've tried to delete the Content permanently or just tried to move it to the Trash
     */
    permanently: boolean;

    /**
     * The Error that caused the failure
     */
    error: any;
}

/**
 * Model for Custom Action executed event
 */
export interface ICustomActionExecuted<T extends Content> {
    /**
     * The Action options
     */
    actionOptions: any;
    /**
     * The additional OData parameters (optional)
     */
    // tslint:disable-next-line:naming-convention
    oDataParams?: ODataParams<T>;
    /**
     * The Action result
     */
    result: any;
}

/**
 * Model for Custom Action Failed event
 */
export interface ICustomActionFailed<T extends Content> {
    /**
     * The Action options
     */
    actionOptions: any;
    /**
     * The additional OData parameters (optional)
     */
    // tslint:disable-next-line:naming-convention
    oDataParams?: ODataParams<T>;
    /**
     * The Error that caused the failure
     */
    error: any;
}

/**
 * Model for Content renamed event
 */
export interface IContentMoved {
    /**
     * The moved Content instance
     */
    content: Content;
}

/**
 * Model for Content Move failed event
 */
export interface IContentMoveFailed {
    /**
     * The Content instance that you've tried to move
     */
    content: Content;
    /**
     * The Error that caused the failure
     */
    error: any;
}

/**
 * Model for Content renamed event
 */
export interface IContentCopied {
    /**
     * The copied Content instance
     */
    content: Content;
    /**
     * The original Content instance
     */
    originalContent: string | number | Array<string | number>;
}

/**
 * Model for Content Move failed event
 */
export interface IContentCopyFailed {
    /**
     * The Content instance that you've tried to copy
     */
    content: Content;
    /**
     * The Error that caused the failure
     */
    error: any;
}
