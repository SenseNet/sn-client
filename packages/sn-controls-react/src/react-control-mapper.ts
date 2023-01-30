/**
 * @module sn-controls-react
 */

import { Repository } from '@sensenet/client-core'
import { ControlMapper } from '@sensenet/control-mapper'
import {
  ChoiceFieldSetting,
  DisplayChoice,
  LongTextFieldSetting,
  ReferenceFieldSetting,
  RichTextFieldSetting,
} from '@sensenet/default-content-types'
import { ComponentType } from 'react'
import * as FieldControls from './fieldcontrols'
import { ReactClientFieldSetting } from './fieldcontrols/client-field-setting'

export type ActionNameType = 'new' | 'edit' | 'browse' | undefined

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
    .setupFieldSettingDefault('NumberFieldSetting', (setting) => {
      if (setting.ControlHint === 'sn:FileSize') {
        return FieldControls.FileSizeField
      } else {
        return FieldControls.NumberField
      }
    })
    .setupFieldSettingDefault('CurrencyFieldSetting', () => {
      return FieldControls.NumberField
    })
    .setupFieldSettingDefault('IntegerFieldSetting', (setting) => {
      switch (setting.Name) {
        case 'PageCount':
          return FieldControls.PageCount
        default:
          return FieldControls.NumberField
      }
    })
    .setupFieldSettingDefault('ColorFieldSetting', () => {
      return FieldControls.ColorPicker
    })
    .setupFieldSettingDefault('BinaryFieldSetting', () => {
      return FieldControls.FileUpload
    })
    .setupFieldSettingDefault('ShortTextFieldSetting', (setting) => {
      switch (setting.ControlHint) {
        case 'sn:Name':
          return FieldControls.Name
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
    .setupFieldSettingDefault<ChoiceFieldSetting>('ChoiceFieldSetting', (setting) => {
      switch (setting.DisplayChoice) {
        case DisplayChoice.CheckBoxes:
          return FieldControls.CheckboxGroup
        case DisplayChoice.DropDown:
          return FieldControls.DropDownList
        case DisplayChoice.RadioButtons:
          return FieldControls.RadioButtonGroup
        default:
          if (setting.AllowMultiple) {
            return FieldControls.CheckboxGroup
          } else {
            return FieldControls.DropDownList
          }
      }
    })
    .setupFieldSettingDefault<ReferenceFieldSetting>('ReferenceFieldSetting', (setting) => {
      if (setting.AllowedTypes && setting.AllowedTypes.indexOf('User') !== -1 && setting.AllowMultiple) {
        return FieldControls.AutoComplete
      } else {
        return FieldControls.ReferenceGrid
      }
    })
    .setupFieldSettingDefault<LongTextFieldSetting>('LongTextFieldSetting', () => {
      return FieldControls.Textarea
    })
    .setupFieldSettingDefault<RichTextFieldSetting>('RichTextFieldSetting', () => {
      return FieldControls.RichTextEditor
    })
    .setupFieldSettingDefault('NullFieldSetting', (setting) => {
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
        switch (setting.ControlHint) {
          case 'sn:Switcher':
            return FieldControls.Switcher
          default:
            return FieldControls.Checkbox
        }
      } else {
        return FieldControls.ShortText
      }
    })
    .setupFieldSettingDefault('BooleanFieldSetting', (setting) => {
      switch (setting.ControlHint) {
        case 'sn:Switcher':
          return FieldControls.Switcher
        default:
          return FieldControls.Checkbox
      }
    })

  return controlMapper
}
