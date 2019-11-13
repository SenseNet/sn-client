/**
 * Describe the state of the preview images
 */
export enum PreviewState {
  /**
   * Preview images are available
   */
  Available = 1,

  /**
   * The document doesn't have any preview images
   */
  Empty = 0,

  /**
   * Preview image generation is in progress
   */
  Loading = -1,

  /**
   * Failed to generate the preview images due an extension error
   */
  ExtensionFailure = -2,

  /**
   * Failed to upload
   */
  UploadFailure = -3,

  /**
   * Failed to upload 2 (?)
   */
  Postponed = -4,

  /**
   * There is no preview provider enabled
   */
  NoPreviewProviderEnabled = -5,

  /**
   *
   */
  ClientFailure = -665,
}
