/**
 * @module Repository
 */
/** */

import { IContent } from "@sensenet/client-core";
import { IODataParams } from "@sensenet/client-core/dist/Models/IODataParams";

/**
 * Model for Content Created event
 */
export interface ICreated {
    /**
     * The created Content instance
     */
    content: IContent;
}

/**
 * Model for Content Creation Failed event
 */
export interface ICreateFailed {
    /**
     * The unsaved Content instance
     */
    content: IContent;

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
    content: IContent;

    /**
     * The Change data
     */
    changes: IContent;
}

/**
 * Model for Content Modification Failed event
 */
export interface IModificationFailed {
    /**
     * The Content instance that has been failed to modify
     */
    content: Partial<IContent>;
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
    content: IContent;
}

/**
 * Model for Content Deleted event
 */
export interface IDeleted {
    /**
     * The Content data that has been deleted
     */
    contentData: IContent;
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
    content: IContent;
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
export interface ICustomActionExecuted<T extends IContent> {
    /**
     * The Action options
     */
    actionOptions: any;
    /**
     * The additional OData parameters (optional)
     */
    // tslint:disable-next-line:naming-convention
    oDataParams?: IODataParams<T>;
    /**
     * The Action result
     */
    result: any;
}

/**
 * Model for Custom Action Failed event
 */
export interface ICustomActionFailed<T extends IContent> {
    /**
     * The Action options
     */
    actionOptions: any;
    /**
     * The additional OData parameters (optional)
     */
    // tslint:disable-next-line:naming-convention
    oDataParams?: IODataParams<T>;
    /**
     * The Type of the Result object
     */
    resultType: { new(...args: any[]): any };
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
    content: IContent;
}

/**
 * Model for Content Move failed event
 */
export interface IContentMoveFailed {
    /**
     * The Content instance that you've tried to move
     */
    content: IContent;
    /**
     * The Error that caused the failure
     */
    error: any;
}
