import { Repository } from '@sensenet/client-core'
import { ControlMapper } from '@sensenet/control-mapper'
import { ChoiceFieldSetting, LongTextFieldSetting, ReferenceFieldSetting } from '@sensenet/default-content-types'
import { ComponentType } from 'react'
import { ReactClientFieldSetting } from '@sensenet/controls-react'
import * as FieldControls from './field-controls'

/**
 * A static Control Mapper instance, used to create the mapping between sensenet ContentTypes and FieldSettings and React components.
 */
export const reactControlMapper = (repository: Repository) => {
  const controlMapper: ControlMapper<ComponentType, ComponentType<ReactClientFieldSetting>> = new ControlMapper<
    ComponentType,
    ComponentType<ReactClientFieldSetting>
  >(
    repository,
    () => null,
    () => null,
  )
  controlMapper
    .setupFieldSettingDefault('NumberFieldSetting', () => {
      return FieldControls.NumberComponent
    })
    .setupFieldSettingDefault('CurrencyFieldSetting', () => {
      return FieldControls.NumberComponent
    })
    .setupFieldSettingDefault('IntegerFieldSetting', () => {
      return FieldControls.NumberComponent
    })
    .setupFieldSettingDefault('ColorFieldSetting', () => {
      return FieldControls.ColorPicker
    })
    .setupFieldSettingDefault('BinaryFieldSetting', () => {
      return FieldControls.FileUpload
    })
    .setupFieldSettingDefault('ShortTextFieldSetting', setting => {
      switch (setting.ControlHint) {
        case 'sn:FileName':
          return FieldControls.FileName
        case 'sn:ColorPicker':
          return FieldControls.ColorPicker
        default:
          return FieldControls.ShortText
      }
    })
    .setupFieldSettingDefault('PasswordFieldSetting', () => {
      return FieldControls.Password
    })
    .setupFieldSettingDefault('DateTimeFieldSetting', () => {
      return FieldControls.DatePicker
    })
    .setupFieldSettingDefault<ChoiceFieldSetting>('ChoiceFieldSetting', setting => {
      switch (setting.DisplayChoice) {
        case 2:
          return FieldControls.CheckboxGroup
        case 0:
          return FieldControls.DropDownList
        case 1:
          return FieldControls.RadioButtonGroup
        default:
          if (setting.AllowMultiple) {
            return FieldControls.CheckboxGroup
          } else {
            return FieldControls.DropDownList
          }
      }
    })
    .setupFieldSettingDefault<ReferenceFieldSetting>('ReferenceFieldSetting', setting => {
      if (setting.AllowedTypes && setting.AllowedTypes.indexOf('User') !== -1 && setting.AllowMultiple) {
        return FieldControls.TagsInput
      } else {
        return FieldControls.ReferenceGrid
      }
    })
    .setupFieldSettingDefault<LongTextFieldSetting>('LongTextFieldSetting', setting => {
      switch (setting.TextType) {
        case 'LongText':
          return FieldControls.Textarea
        case 'RichText':
        case 'AdvancedRichText':
          return FieldControls.RichTextEditor
        default:
          if (setting.ControlHint === 'sn:QueryBuilder') {
            return FieldControls.Textarea
          } else {
            return FieldControls.RichTextEditor
          }
      }
    })
    .setupFieldSettingDefault('NullFieldSetting', setting => {
      if (setting.Name === 'Avatar') {
        return FieldControls.Avatar
      } else if (
        ['SiteRelativeUrl', 'UploadBinary', 'ButtonList', 'ReferenceDropDown', 'PageTemplateSelector'].indexOf(
          setting.Name,
        ) > -1
      ) {
        return FieldControls.EmptyFieldControl
      } else if (setting.Name === 'AllowedChildTypes') {
        return FieldControls.AllowedChildTypes
      } else if (setting.Name === 'UrlList') {
        return FieldControls.Textarea
      } else if (setting.FieldClassName.indexOf('BooleanField') > -1) {
        return FieldControls.BooleanComponent
      } else {
        return FieldControls.ShortText
      }
    })
    .setupFieldSettingDefault('BooleanFieldSetting', () => {
      return FieldControls.BooleanComponent
    })

  return controlMapper
}
