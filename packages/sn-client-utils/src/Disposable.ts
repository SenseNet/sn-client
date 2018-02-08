/**
 *
 * You can implement *IDisposable* resources and use them with a *using()* or *usingAsync()* syntax.
 *
 * Usage example:
 *
 * ```ts
 * class Resource implements IDisposable{
 *       dispose(){
 *           // cleanup logics
 *      }
 * }
 *
 *
 * using(new Resource(), (resource)=>{
 *      // do something with the resource
 * })
 *
 * usingAsync(new Resource(), async (resource)=>{
 *      // do something with the resource, allows awaiting promises
 * })
 * ```
 */
/** */

/**
 * Resources in using an usingAsync should implement this interface
 * @category Disposable
 */
export interface IDisposable {
    /**
     * Method called when the IDisposable is disposed.
     */
    dispose: () => void;
}

/**
 * Method that accepts an IDisposable resource that will be disposed after the callback
 * @param {IDisposable} resource The resource that is used in the callback and will be disposed afterwards
 * @param {function} callback The callback that will be executed synchrounously before the resource will be disposed
 */
export const using = <T extends IDisposable, TReturns>(resource: T, callback: (resource: T) => TReturns) => {
    try {
        return callback(resource);
    } finally {
        resource.dispose();
    }
};

/**
 * Method that accepts an IDisposable resource that will be disposed after the callback
 * @param {IDisposable} resource The resource that is used in the callback and will be disposed afterwards
 * @param {function} callback The callback that will be executed asynchrounously before the resource will be disposed
 */
export const usingAsync = async <T extends IDisposable, TReturns>
    (resource: T, callback: (resource: T) => Promise<TReturns>) => {
    try {
        return await callback(resource);
    } finally {
        resource.dispose();
    }
};
