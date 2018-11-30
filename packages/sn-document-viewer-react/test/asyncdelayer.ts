/**
 * helper method that delays an asynchronous method execution
 * @param {number} ms The delay amount in milliseconds
 */
export const asyncDelay: (ms: number) => Promise<void> = async ms => {
  return await new Promise<void>(resolve => {
    setTimeout(() => resolve(), ms)
  })
}
