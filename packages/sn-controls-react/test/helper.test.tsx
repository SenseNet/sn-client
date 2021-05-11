import { Repository } from '@sensenet/client-core'
import { FieldSetting } from '@sensenet/default-content-types'
import { isFullWidthField } from '../src/helpers'
import { schema } from './__mocks__/schema'

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

  const testRepository = new Repository(
    {
      schemas: schema,
    },
    jest.fn(() => {
      return {
        ok: true,
        json: jest.fn(),
      }
    }) as any,
  )

  describe('isFullWidthField', () => {
    it('should return true when the current content type is User', () => {
      const isFullWidth = isFullWidthField(testBooleanField, 'User', testRepository)
      expect(isFullWidth).toBeTruthy()
    })
    it(`should return true when the current content type's parent type is User`, () => {
      const isFullWidth = isFullWidthField(testBooleanField, 'SNaaSUser', testRepository)
      expect(isFullWidth).toBeTruthy()
    })
    it('should return true when the current content type is WebHookSubscription', () => {
      const isFullWidth = isFullWidthField(testBooleanField, 'WebHookSubscription', testRepository)
      expect(isFullWidth).toBeTruthy()
    })
    it(`should return true when the current content type's parent type is WebHookSubscription`, () => {
      const isFullWidth = isFullWidthField(testBooleanField, 'GatsbyWebHookSubscription', testRepository)
      expect(isFullWidth).toBeTruthy()
    })
    it(`should return true when the given field control is LongTextFieldSetting`, () => {
      const isFullWidth = isFullWidthField(testLongTextField, 'Article', testRepository)
      expect(isFullWidth).toBeTruthy()
    })
    it(`should return false when the type is Folder and the field is ShortText`, () => {
      const isFullWidth = isFullWidthField(testShortTextField, 'Folder', testRepository)
      expect(isFullWidth).toBeFalsy()
    })
  })
})
