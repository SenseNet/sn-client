/**
 * This class represents a plain response body that is returned from sensenet ECM in case of a succesfully login.
 */
export interface RefreshResponse {
  /**
   * The Access Token head and payload in a Base64 encoded format
   */
  access: string
}
