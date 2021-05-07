import { FieldSetting } from '@sensenet/default-content-types'
import { isFullWidthField } from '../src/helpers'

describe('Helpers', () => {
  const testBooleanField = {
    fieldSettings: {
      Type: 'BooleanFieldSetting',
      Name: 'Enabled',
      FieldClassName: 'SenseNet.ContentRepository.Fields.BooleanField',
      DisplayName: 'Enabled',
      Description: 'User account is enabled.',
    } as FieldSetting,
  }

  const testLongTextField = {
    fieldSettings: {
      Type: 'LongTextFieldSetting',
      Name: 'Body',
      FieldClassName: 'SenseNet.ContentRepository.Fields.LongTextField',
      DisplayName: 'Body',
      Description: 'Body text.',
    } as FieldSetting,
  }

  const testShortTextField = {
    fieldSettings: {
      Type: 'ShortTextFieldSetting',
      Name: 'DisplayName',
      FieldClassName: 'SenseNet.ContentRepository.Fields.ShortTextField',
      DisplayName: 'DisplayName',
      Description: 'DisplayName of the content.',
    } as FieldSetting,
  }
  describe('isFullWidthField', () => {
    it('should return true when the current content type is User', () => {
      const isFullWidth = isFullWidthField(testBooleanField, 'User', 'GenericContent')
      expect(isFullWidth).toBeTruthy()
    })
    it(`should return true when the current content type's parent type is User`, () => {
      const isFullWidth = isFullWidthField(testBooleanField, 'SNaaSUser', 'User')
      expect(isFullWidth).toBeTruthy()
    })
    it('should return true when the current content type is WebHookSubscription', () => {
      const isFullWidth = isFullWidthField(testBooleanField, 'WebHookSubscription', 'GenericContent')
      expect(isFullWidth).toBeTruthy()
    })
    it(`should return true when the current content type's parent type is WebHookSubscription`, () => {
      const isFullWidth = isFullWidthField(testBooleanField, 'GatsbyWebHookSubscription', 'WebHookSubscription')
      expect(isFullWidth).toBeTruthy()
    })
    it(`should return true when the given field control is LongTextFieldSetting`, () => {
      const isFullWidth = isFullWidthField(testLongTextField, 'Article', 'GenericContent')
      expect(isFullWidth).toBeTruthy()
    })
    it(`should return false when the type is Folder and the field is ShortText`, () => {
      const isFullWidth = isFullWidthField(testShortTextField, 'Folder', 'GenericContent')
      expect(isFullWidth).toBeFalsy()
    })
  })
})
