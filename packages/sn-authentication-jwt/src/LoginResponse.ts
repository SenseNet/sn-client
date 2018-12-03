/**
 * This class represents a plain response body that is returned from sensenet in case of a succesfully login.
 */
export interface LoginResponse {
  /**
   * The Access Token head and payload in a Base64 encoded format
   */
  access: string

  /**
   * The Refresh Token head and payload in a Base64 encoded format
   */
  refresh: string
}
