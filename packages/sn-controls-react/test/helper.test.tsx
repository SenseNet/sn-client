import { isFullWidthField } from '../src/helpers'
import { testBooleanField, testLongTextField, testShortTextField } from './__mocks__/fields'
import { testRepository } from './__mocks__/repository'
import { testArticle, testFolder, testUser, testWebHookSubscription } from './__mocks__/types'

describe('Helpers', () => {
  describe('isFullWidthField', () => {
    it('should return true when the current content type is User', () => {
      const isFullWidth = isFullWidthField(testBooleanField, testUser, testRepository)
      expect(isFullWidth).toBeTruthy()
    })
    it('should return true when the current content type is WebHookSubscription', () => {
      const isFullWidth = isFullWidthField(testBooleanField, testWebHookSubscription, testRepository)
      expect(isFullWidth).toBeTruthy()
    })
    it(`should return true when the given field control is LongTextFieldSetting`, () => {
      const isFullWidth = isFullWidthField(testLongTextField, testArticle, testRepository)
      expect(isFullWidth).toBeTruthy()
    })
    it(`should return false when the type is Folder and the field is ShortText`, () => {
      const isFullWidth = isFullWidthField(testShortTextField, testFolder, testRepository)
      expect(isFullWidth).toBeFalsy()
    })
  })
})
