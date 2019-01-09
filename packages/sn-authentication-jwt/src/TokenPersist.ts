/**
 * This enum shows how the token should be persisted.
 */
export enum TokenPersist {
  /**
   * Token should be removed on session end (browser close)
   */
  Session,
  /**
   * Token should be removed when the token will be expired
   */
  Expiration,
}
