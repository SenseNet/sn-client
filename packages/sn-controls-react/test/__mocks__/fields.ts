import { FieldSetting } from '@sensenet/default-content-types'

export const testBooleanField = {
  fieldSettings: {
    Type: 'BooleanFieldSetting',
    Name: 'Enabled',
    FieldClassName: 'SenseNet.ContentRepository.Fields.BooleanField',
    DisplayName: 'Enabled',
    Description: 'User account is enabled.',
  } as FieldSetting,
}

export const testLongTextField = {
  fieldSettings: {
    Type: 'LongTextFieldSetting',
    Name: 'Body',
    FieldClassName: 'SenseNet.ContentRepository.Fields.LongTextField',
    DisplayName: 'Body',
    Description: 'Body text.',
  } as FieldSetting,
}

export const testShortTextField = {
  fieldSettings: {
    Type: 'ShortTextFieldSetting',
    Name: 'DisplayName',
    FieldClassName: 'SenseNet.ContentRepository.Fields.ShortTextField',
    DisplayName: 'DisplayName',
    Description: 'DisplayName of the content.',
  } as FieldSetting,
}
