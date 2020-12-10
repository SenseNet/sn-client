import React from 'react'
import { PreviewState } from '../enums'

export const defaultLocalization = {
  rotateDocumentLeft: 'Rotate document left',
  rotateDocumentRight: 'Rotate document right',
  rotatePageLeft: 'Rotate page left',
  rotatePageRight: 'Rotate page right',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  toggleRedaction: 'Toggle redaction',
  toggleWatermark: 'Toggle watermark',
  toggleShapes: 'Toggle shapes',
  toggleThumbnails: 'Toggle thumbnails',
  toggleComments: 'Toggle comments',
  firstPage: 'First page',
  previousPage: 'Previous page',
  gotoPage: 'Goto page',
  nextPage: 'Next page',
  lastPage: 'Last page',
  saveChanges: 'Save changes',
  loadingDocument: 'Preview image generation is in progress',
  regeneratePreviews: 'The preview images are not generated yet. Do you want to generate them?',
  regenerateButton: 'Generate',
  errorLoadingDocument: [
    { state: PreviewState.Empty, message: 'No preview available, because the document is empty!', details: '' },
    {
      code: 500,
      state: PreviewState.Empty,
      message: 'Ooops! Something went wrong...',
      details:
        'An unexpected error seems to have occured. Why not try refreshing your page? If the page still not working try to check back later.',
    },
    {
      code: 404,
      state: PreviewState.Empty,
      message: 'Ooops! Something went wrong...',
      details: `You don't have permission to see this document \r\n The document you are trying to open has been deleted \r\n The document has been moved to another place `,
    },
    {
      state: PreviewState.UploadFailure,
      message: 'Error during preview generation! No preview available.',
      details: '',
    },
    {
      state: PreviewState.Postponed,
      message: 'The preview image generation has been postponed.',
      details: '',
    },
    {
      state: PreviewState.ExtensionFailure,
      message: 'No preview available, because this type of file is not supported!',
      details: '',
    },
    { state: PreviewState.NoPreviewProviderEnabled, message: 'There is no preview provider enabled', details: '' },
  ],
  errorLoadingDetails: 'The following error occured during opening a document: ',
  unknownError: 'Unknown error',
  reloadPage: 'Reload page',
  search: 'Search',
  share: 'Share',
  download: 'Download',
  print: 'Print',
  showMore: '+ Show more',
  showLess: '+ Show less',
  avatarAlt: 'Picture of the commenter',
  delete: 'Delete',
  deleteCommentDialogTitle: 'Delete comment?',
  deleteCommentDialogBody: `1 comment is about to permanently deleted. <br /><strong>Warning: You can't undo this action.</strong>`,
  okButton: 'Ok',
  cancelButton: 'Cancel',
  addComment: '+ Add Comment',
  commentInputPlaceholder: 'Make a comment',
  submit: 'Submit',
  inputRequiredError: 'The comment text is a required field.',
  markerRequiredError: 'You must place the marker first.',
  markerTooltip: 'You can put a marker with this button',
  commentSideBarTitle: 'Comments',
}

export const LocalizationContext = React.createContext(defaultLocalization)

export type LocalizationType = typeof defaultLocalization
