import {
  applyShapeRotations,
  documentPermissionsReceived,
  documentReceivedAction,
  documentReceiveErrorAction,
  pollDocumentData,
  removeShape,
  resetDocumentData,
  rotateShapesForPages,
  saveChanges,
  saveChangesError,
  saveChangesRequest,
  saveChangesSuccess,
  setPollInterval,
  updateShapeData,
} from '../src/store/Document'

import { DocumentData } from '../src/models'
import { setLocalization } from '../src/store/Localization'
import {
  availabelImagesReceivedAction,
  availabelImagesReceiveErrorAction,
  getAvailabelImagesAction,
  getAvailableImages,
  previewAvailable,
  previewAvailableAction,
  previewAvailableErrorAction,
  previewAvailableReceivedAction,
  previewNotAvailableReceivedAction,
  rotateImages,
  setPagePollInterval,
} from '../src/store/PreviewImages'

import { setSelectedCommentId } from '../src/store/Comments'
import {
  setActivePages,
  setCustomZoomLevel,
  setFitRelativeZoomLevel,
  setRedaction,
  setShapes,
  setThumbnails,
  setWatermark,
  setZoomMode,
} from '../src/store/Viewer'

describe('Actions', () => {
  describe('Document actions', () => {
    it('Should match their snapshots', () => {
      expect(applyShapeRotations([], 90, [])).toMatchSnapshot()
      expect(documentPermissionsReceived(true, true, true)).toMatchSnapshot()
      expect(documentReceivedAction({ documentName: 'doc' } as any)).toMatchSnapshot()
      expect(documentReceiveErrorAction({ message: 'Error :(' })).toMatchSnapshot()
      expect(pollDocumentData('https://my-sn-site-com', 5, 'V1.0A')).toMatchSnapshot()
      expect(removeShape('annotations', '123456')).toMatchSnapshot()
      expect(resetDocumentData()).toMatchSnapshot()
      expect(rotateShapesForPages([{ index: 1, size: { height: 12, width: 12 } }], -90)).toMatchSnapshot()
      expect(saveChanges()).toMatchSnapshot()
      expect(saveChangesError({ message: 'Error' })).toMatchSnapshot()
      expect(saveChangesRequest()).toMatchSnapshot()
      expect(saveChangesSuccess()).toMatchSnapshot()
      expect(setPollInterval(1000)).toMatchSnapshot()
      expect(
        updateShapeData('redactions', '123456', { guid: '123', h: 1, w: 1, imageIndex: 1, x: 1, y: 1 }),
      ).toMatchSnapshot()
    })
  })

  describe('Localization actions', () => {
    it('Should match their snapshots', () => {
      expect(setLocalization({ download: 'Letöltés' })).toMatchSnapshot()
    })
  })

  describe('PreviewImages actions', () => {
    it('Should match their snapshots', () => {
      const exampleDocData = ({ documentName: 'Document' } as any) as DocumentData

      expect(availabelImagesReceivedAction([])).toMatchSnapshot()
      expect(availabelImagesReceiveErrorAction('Error :(')).toMatchSnapshot()
      expect(getAvailabelImagesAction(exampleDocData)).toMatchSnapshot()
      expect(getAvailableImages(exampleDocData)).toMatchSnapshot()
      expect(previewAvailable(exampleDocData)).toMatchSnapshot()
      expect(previewAvailableAction(exampleDocData, 'V1.0A', 3)).toMatchSnapshot()
      expect(previewAvailableErrorAction('error :(')).toMatchSnapshot()
      expect(
        previewAvailableReceivedAction(exampleDocData, 'V1.0A', 3, {
          Width: 320,
          Height: 200,
          Index: 1,
        }),
      ).toMatchSnapshot()
      expect(previewNotAvailableReceivedAction()).toMatchSnapshot()
      expect(rotateImages([1], 90)).toMatchSnapshot()
      expect(setPagePollInterval(1000)).toMatchSnapshot()
    })
  })

  describe('Viewer Actions', () => {
    it('Should match their snapshots', () => {
      expect(setActivePages([1, 2, 3])).toMatchSnapshot()
      expect(setCustomZoomLevel(3)).toMatchSnapshot()
      expect(setFitRelativeZoomLevel(2)).toMatchSnapshot()
      expect(setRedaction(true)).toMatchSnapshot()
      expect(setShapes(true)).toMatchSnapshot()
      expect(setThumbnails(true)).toMatchSnapshot()
      expect(setWatermark(true)).toMatchSnapshot()
      expect(setZoomMode('fit')).toMatchSnapshot()
    })
  })

  describe('Comments actions', () => {
    it('should match their snapshot', () => {
      expect(setSelectedCommentId('someId')).toMatchSnapshot()
    })
  })
})
