import { PathHelper } from '@sensenet/client-utils'
import { Content } from '../index'
import { ODataCollectionResponse } from '../Models/ODataCollectionResponse'
import { ODataParams } from '../Models/ODataParams'
import { ODataResponse } from '../Models/ODataResponse'
import { Repository } from './Repository'

/**
 * Class that contains shortcuts for versioning-related custom content actions
 */
export class Versioning {
  /**
   * Returns a collection of content versions
   * @param {number | string} idOrPath The unique identifier or full path of the original content
   * @param {ODataParams<T> | undefined} oDataOptions optional OData options
   * @returns {Promise<ODataCollectionResponse<T>>} A promise that will be resolved with the versions
   */
  public getVersions<T extends Content = Content>(
    idOrPath: number | string,
    oDataOptions?: ODataParams<T>,
  ): Promise<ODataCollectionResponse<T>> {
    return this.repository.loadCollection<T>({
      path: PathHelper.joinPaths(PathHelper.getContentUrl(idOrPath), 'Versions'),
      oDataOptions,
    })
  }

  /**
   * Checks out the content item to the current user
   * @param {number | string} idOrPath The unique identifier or full path of the content to check out
   * @param {ODataParams<T>} oDataOptions Optional OData options
   * @returns {Promise<T>} A promise that will be resolved with the checked out version of the content item
   */
  public checkOut<T extends Content = Content>(idOrPath: number | string, oDataOptions?: ODataParams<T>) {
    return this.repository.executeAction<undefined, ODataResponse<T>>({
      name: 'Checkout',
      idOrPath,
      method: 'POST',
      body: undefined,
      oDataOptions,
    })
  }

  /**
   * Checks in the content item
   * @param {number | string} idOrPath The unique identifier or full path of the content to check in
   * @param {string} checkInComments Optional comments for the check in operation
   * @param {ODataParams<T>} oDataOptions Optional OData options
   * @returns {Promise<T>} A promise that will be resolved with the new checked in version of the content item
   */
  public checkIn<T extends Content = Content>(
    idOrPath: number | string,
    checkInComments: string = '',
    oDataOptions?: ODataParams<T>,
  ) {
    return this.repository.executeAction<{ checkInComments: string }, ODataResponse<T>>({
      name: 'CheckIn',
      idOrPath,
      method: 'POST',
      body: {
        checkInComments,
      },
      oDataOptions,
    })
  }

  /**
   * Performs an undo check out operation on a content item
   * @param {number | string} idOrPath The unique identifier or full path of the content
   * @param {ODataParams<T>} oDataOptions Optional OData options
   * @returns {Promise<T>} A promise that will be resolved with the previous checked in version of the content item
   */
  public undoCheckOut<T extends Content = Content>(idOrPath: number | string, oDataOptions?: ODataParams<T>) {
    return this.repository.executeAction<undefined, ODataResponse<T>>({
      name: 'UndoCheckOut',
      idOrPath,
      method: 'POST',
      body: undefined,
      oDataOptions,
    })
  }

  /**
   * Performs a force undo check out operation on a content item
   * @param {number | string} idOrPath The unique identifier or full path of the content
   * @param {ODataParams<T>} oDataOptions Optional OData options
   * @returns {Promise<T>} A promise that will be resolved with the previous checked in version of the content item
   */
  public forceUndoCheckOut<T extends Content = Content>(idOrPath: number | string, oDataOptions?: ODataParams<T>) {
    return this.repository.executeAction<undefined, ODataResponse<T>>({
      name: 'ForceUndoCheckout',
      idOrPath,
      method: 'POST',
      body: undefined,
      oDataOptions,
    })
  }

  /**
   * Performs an approve operation on a content
   * @param idOrPath The unique identifier or full path of the content to approve
   * @param oDataOptions Optional OData options
   * @returns {Promise<ODataResponse<T>>} A promise that will be resolved when the operation finished
   */
  public approve<T extends Content = Content>(idOrPath: number | string, oDataOptions?: ODataParams<T>) {
    return this.repository.executeAction<undefined, ODataResponse<T>>({
      name: 'Approve',
      idOrPath,
      method: 'POST',
      body: undefined,
      oDataOptions,
    })
  }

  /**
   * Performs a reject operation on a content
   * @param idOrPath The unique identifier or full path of the content
   * @param oDataOptions Optional OData options
   * @returns {Promise<ODataResponse<T>>} A promise that will be resolved when the operation finished
   */
  public reject<T extends Content = Content>(
    idOrPath: number | string,
    rejectReason: string = '',
    oDataOptions?: ODataParams<T>,
  ) {
    return this.repository.executeAction<{ rejectReason: string }, ODataResponse<T>>({
      name: 'Reject',
      idOrPath,
      method: 'POST',
      body: {
        rejectReason,
      },
      oDataOptions,
    })
  }

  /**
   * Performs a Publish operation on a content
   * @param idOrPath The unique identifier or full path of the content to publish
   * @param oDataOptions Optional OData options
   * @returns {Promise<ODataResponse<T>>} A promise that will be resolved when the operation finished
   */
  public publish<T extends Content = Content>(idOrPath: number | string, oDataOptions?: ODataParams<T>) {
    return this.repository.executeAction<undefined, ODataResponse<T>>({
      name: 'Publish',
      idOrPath,
      method: 'POST',
      body: undefined,
      oDataOptions,
    })
  }

  /**
   * Performs a reject operation on a content
   * @param idOrPath The unique identifier or full path of the content
   * @param oDataOptions Optional OData options
   * @returns {Promise<ODataResponse<T>>} A promise that will be resolved when the operation finished
   */
  public restoreVersion<T extends Content = Content>(
    idOrPath: number | string,
    version: string = '',
    oDataOptions?: ODataParams<T>,
  ) {
    return this.repository.executeAction<{ version: string }, ODataResponse<T>>({
      name: 'RestoreVersion',
      idOrPath,
      method: 'POST',
      body: {
        version,
      },
      oDataOptions,
    })
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
      name: 'TakeLockOver',
      idOrPath,
      method: 'POST',
      body: {
        user: userIdOrPath || null,
      },
    })
  }

  constructor(private readonly repository: Repository) {}
}
