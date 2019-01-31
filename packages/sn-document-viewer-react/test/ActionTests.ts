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
describe('Actions', () => {
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
