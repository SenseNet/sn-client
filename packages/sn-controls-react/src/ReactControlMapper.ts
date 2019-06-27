/**
 * @module sn-controls-react
 */

import { Repository } from '@sensenet/client-core'
import { ControlMapper } from '@sensenet/control-mapper'
import {
  BooleanFieldSetting,
  ChoiceFieldSetting,
  ColorFieldSetting,
  CurrencyFieldSetting,
  DateTimeFieldSetting,
  IntegerFieldSetting,
  LongTextFieldSetting,
  NullFieldSetting,
  NumberFieldSetting,
  PasswordFieldSetting,
  ReferenceFieldSetting,
  ShortTextFieldSetting,
  DateTimeMode,
} from '@sensenet/default-content-types'
import { ComponentType } from 'react'
import * as FieldControls from './fieldcontrols'
import { ReactClientFieldSetting } from './fieldcontrols/ClientFieldSetting'

/**
 * A static Control Mapper instance, used to create the mapping between sensenet ECM ContentTypes and FieldSettings and React components.
 */
export const reactControlMapper = (repository: Repository) => {
  const controlMapper: ControlMapper<ComponentType, ComponentType<ReactClientFieldSetting>> = new ControlMapper<
    ComponentType,
    ComponentType<ReactClientFieldSetting>
  >(repository, () => null, () => null)
  controlMapper
    .setupFieldSettingDefault(NumberFieldSetting, () => {
      return FieldControls.NumberComponent
    })
    .setupFieldSettingDefault(CurrencyFieldSetting, () => {
      return FieldControls.NumberComponent
    })
    .setupFieldSettingDefault(IntegerFieldSetting, () => {
      return FieldControls.NumberComponent
    })
    .setupFieldSettingDefault(ColorFieldSetting, () => {
      return FieldControls.ColorPicker
    })
    .setupFieldSettingDefault(ShortTextFieldSetting, setting => {
      switch (setting.ControlHint) {
        case 'sn:Name':
          return FieldControls.Name
        case 'sn:DisplayName':
          return FieldControls.DisplayName
        case 'sn:FileName':
          return FieldControls.FileName
        case 'sn:ColorPicker':
          return FieldControls.ColorPicker
        default:
          return FieldControls.ShortText
      }
    })
    .setupFieldSettingDefault(PasswordFieldSetting, () => {
      return FieldControls.Password
    })
    .setupFieldSettingDefault(DateTimeFieldSetting, setting => {
      if (setting.DateTimeMode && setting.DateTimeMode === DateTimeMode.Date) {
        return FieldControls.DatePicker
      }
      return FieldControls.DateTimePicker
    })
    .setupFieldSettingDefault(ChoiceFieldSetting, setting => {
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
    .setupFieldSettingDefault(ReferenceFieldSetting, setting => {
      if (setting.AllowedTypes && setting.AllowedTypes.indexOf('User') !== -1 && setting.AllowMultiple) {
        return FieldControls.TagsInput
      } else {
        return FieldControls.ReferenceGrid
      }
    })
    .setupFieldSettingDefault(LongTextFieldSetting, setting => {
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
    .setupFieldSettingDefault(NullFieldSetting, setting => {
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
        return FieldControls.Boolean
      } else {
        return FieldControls.ShortText
      }
    })
    .setupFieldSettingDefault(BooleanFieldSetting, () => {
      return FieldControls.Boolean
    })

  return controlMapper
}
