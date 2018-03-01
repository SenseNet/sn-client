/**
 * Method checking if the given object is a Promise or not.
 * @param obj {object} The object that should be checked.
 * Usage example:
 *
 * ```
 * import { isPromise } from '@sensenet/redux-promise-middleware'
 *
 * isPromise(myObject)
 */
export const isPromise = (obj) => Promise.resolve(obj) === obj
