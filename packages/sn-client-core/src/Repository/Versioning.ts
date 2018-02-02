import { PathHelper } from "@sensenet/client-utils/dist/PathHelper";
import { IContent } from "../index";
import { IODataCollectionResponse } from "../Models/IODataCollectionResponse";
import { IODataParams } from "../Models/IODataParams";
import { IODataResponse } from "../Models/IODataResponse";
import { Repository } from "./Repository";

/**
 * Class that contains shortcuts for versioning-related custom content actions
 */
export class Versioning {

    /**
     * Returns a collection of content versions
     * @param {number | string} idOrPath The unique identifier or full path of the original content
     * @param {IODataParams<T> | undefined} oDataOptions optional OData options
     * @returns {Promise<IODataCollectionResponse<T>>} A promise that will be resolved with the versions
     */
    public getVersions<T extends IContent = IContent>(idOrPath: number | string, oDataOptions?: IODataParams<T>): Promise<IODataCollectionResponse<T>> {
        return this.repository.loadCollection<T>({
            path: PathHelper.joinPaths(
                this.repository.configuration.repositoryUrl,
                this.repository.configuration.oDataToken,
                PathHelper.getContentUrl(idOrPath),
                "Versions"),
            oDataOptions,
        });
    }

    /**
     * Checks out the content item to the current user
     * @param {number | string} idOrPath The unique identifier or full path of the content to check out
     * @param {IODataParams<T>} oDataOptions Optional OData options
     * @returns {Promise<T>} A promise that will be resolved with the checked out version of the content item
     */
    public checkOut<T extends IContent = IContent>(idOrPath: number | string, oDataOptions?: IODataParams<T>) {
        return this.repository.executeAction<undefined, IODataResponse<T>>({
            name: "Checkout",
            idOrPath,
            method: "POST",
            body: undefined,
            oDataOptions,
        });
    }

    /**
     * Checks in the content item
     * @param {number | string} idOrPath The unique identifier or full path of the content to check in
     * @param {string} checkInComments Optional comments for the check in operation
     * @param {IODataParams<T>} oDataOptions Optional OData options
     * @returns {Promise<T>} A promise that will be resolved with the new checked in version of the content item
     */
    public checkIn<T extends IContent = IContent>(idOrPath: number | string, checkInComments: string = "", oDataOptions?: IODataParams<T>) {
        return this.repository.executeAction<{ checkInComments: string }, IODataResponse<T>>({
            name: "CheckIn",
            idOrPath,
            method: "POST",
            body: {
                checkInComments,
            },
            oDataOptions,
        });
    }

    /**
     * Performs an undo check out operation on a content item
     * @param {number | string} idOrPath The unique identifier or full path of the content
     * @param {IODataParams<T>} oDataOptions Optional OData options
     * @returns {Promise<T>} A promise that will be resolved with the previous checked in version of the content item
     */
    public undoCheckOut<T extends IContent = IContent>(idOrPath: number | string, oDataOptions?: IODataParams<T>) {
        return this.repository.executeAction<undefined, IODataResponse<T>>({
            name: "UndoCheckOut",
            idOrPath,
            method: "POST",
            body: undefined,
            oDataOptions,
        });
    }

    /**
     * Performs a force undo check out operation on a content item
     * @param {number | string} idOrPath The unique identifier or full path of the content
     * @param {IODataParams<T>} oDataOptions Optional OData options
     * @returns {Promise<T>} A promise that will be resolved with the previous checked in version of the content item
     */
    public forceUndoCheckOut<T extends IContent = IContent>(idOrPath: number | string, oDataOptions?: IODataParams<T>) {
        return this.repository.executeAction<undefined, IODataResponse<T>>({
            name: "ForceUndoCheckout",
            idOrPath,
            method: "POST",
            body: undefined,
            oDataOptions,
        });
    }

    /**
     * Performs an approve operation on a content
     * @param idOrPath The unique identifier or full path of the content to approve
     * @param oDataOptions Optional OData options
     * @returns {Promise<IODataResponse<T>>} A promise that will be resolved when the operation finished
     */
    public approve<T extends IContent = IContent>(idOrPath: number | string, oDataOptions?: IODataParams<T>) {
        return this.repository.executeAction<undefined, IODataResponse<T>>({
             name: "Approve",
             idOrPath,
             method: "POST",
             body: undefined,
             oDataOptions,
        });
    }

    /**
     * Performs a reject operation on a content
     * @param idOrPath The unique identifier or full path of the content
     * @param oDataOptions Optional OData options
     * @returns {Promise<IODataResponse<T>>} A promise that will be resolved when the operation finished
     */
    public reject<T extends IContent = IContent>(idOrPath: number | string, rejectReason: string = "", oDataOptions?: IODataParams<T>) {
        return this.repository.executeAction<{rejectReason: string}, IODataResponse<T>>({
             name: "Reject",
             idOrPath,
             method: "POST",
             body: {
                rejectReason,
             },
             oDataOptions,
        });
    }

    /**
     * Performs a Publish operation on a content
     * @param idOrPath The unique identifier or full path of the content to publish
     * @param oDataOptions Optional OData options
     * @returns {Promise<IODataResponse<T>>} A promise that will be resolved when the operation finished
     */
    public publish<T extends IContent = IContent>(idOrPath: number | string, oDataOptions?: IODataParams<T>) {
        return this.repository.executeAction<undefined, IODataResponse<T>>({
             name: "Publish",
             idOrPath,
             method: "POST",
             body: undefined,
             oDataOptions,
        });
    }

    /**
     * Performs a reject operation on a content
     * @param idOrPath The unique identifier or full path of the content
     * @param oDataOptions Optional OData options
     * @returns {Promise<IODataResponse<T>>} A promise that will be resolved when the operation finished
     */
    public restoreVersion<T extends IContent = IContent>(idOrPath: number | string, version: string = "", oDataOptions?: IODataParams<T>) {
        return this.repository.executeAction<{version: string}, IODataResponse<T>>({
             name: "RestoreVersion",
             idOrPath,
             method: "POST",
             body: {
                version,
             },
             oDataOptions,
        });
    }

    /**
     * Lets administrators take over the lock of a checked out document from anotheruser.
     * A new locker user can be provided using the 'user' parameter (user path or id as string).
     * If left empty, the current user will take the lock.
     * @param {number | string} idOrPath The locked content's identifier or full path
     * @param {number | string | undefined} userIdOrPath Path or id of the new locker user. Will be the current user, if not provided
     * @returns {Promise<void>} A promise that will be resolved when the operation finished.
     */
    public takeLockOver(idOrPath: number | string, userIdOrPath?: number | string) {
        return this.repository.executeAction<any, void>({
            name: "TakeLockOver",
            idOrPath,
            method: "POST",
            body: {
                user: userIdOrPath || null,
            },
        });
    }

    constructor(private readonly repository: Repository) {

    }
}
