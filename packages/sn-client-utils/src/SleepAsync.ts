/**
 * Returns a simple promise that will be resolved within a discrete timeout
 * @param timeout The timeout in millisecs
 */
export const sleepAsync = (timeout: number = 250) => new Promise((resolve) => setTimeout(() => {
    resolve();
}, timeout));
