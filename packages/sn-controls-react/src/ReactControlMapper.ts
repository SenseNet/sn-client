/**
 * @module sn-controls-react
 */

import { Repository } from '@sensenet/client-core'
import { ControlMapper } from '@sensenet/control-mapper'
import {
  BooleanFieldSetting,
  ChoiceFieldSetting,
  DateTimeFieldSetting,
  FieldSetting,
  IntegerFieldSetting,
  LongTextFieldSetting,
  NullFieldSetting,
  NumberFieldSetting,
  PasswordFieldSetting,
  ReferenceFieldSetting,
  ShortTextFieldSetting,
} from '@sensenet/default-content-types'
import { Component } from 'react'
import * as FieldControls from './fieldcontrols'
import { ReactChoiceFieldSetting } from './fieldcontrols/ChoiceFieldSetting'
import { ReactClientFieldSetting } from './fieldcontrols/ClientFieldSetting'
import { ReactDateTimeFieldSetting } from './fieldcontrols/DateTimeFieldSetting'
import { ReactLongTextFieldSetting } from './fieldcontrols/LongTextFieldSetting'
import { ReactNumberFieldSetting } from './fieldcontrols/Number/NumberFieldSetting'
import { ReactReferenceFieldSetting } from './fieldcontrols/ReferenceFieldSetting'
import { ReactShortTextFieldSetting } from './fieldcontrols/ShortText/ShortTextFieldSetting'
import * as ViewControls from './viewcontrols'

/**
 * @description A client config instance, used to create a defaul mapping between the basic React props and sensenet ECM fields.
 */

const clientConfigFactory = (fieldSettings: FieldSetting) => {
  const defaultSetting: ReactClientFieldSetting = {
    key: fieldSettings.Name,
    name: fieldSettings.Name as any,
    readOnly: fieldSettings.ReadOnly || false,
    required: fieldSettings.Compulsory || false,
    onChange: (field, value) => console.log({ field, value }),
    hintText: fieldSettings.Description || '',
    placeHolderText: fieldSettings.DisplayName || '',
    labelText: fieldSettings.DisplayName || '',
  }
  defaultSetting['data-typeName'] = fieldSettings.Type || ''
  return defaultSetting
}

/**
 * A static Control Mapper instance, used to create the mapping between sensenet ECM ContentTypes and FieldSettings and React components.
 */
export const reactControlMapper = (repository: Repository) =>
  new ControlMapper(repository, Component, clientConfigFactory, ViewControls.EditView, FieldControls.ShortText)
    .setupFieldSettingDefault(NumberFieldSetting, () => {
      return FieldControls.Number
    })
    .setClientControlFactory(NumberFieldSetting, setting => {
      const numberSettings = clientConfigFactory(setting) as ReactNumberFieldSetting
      numberSettings['data-digits'] = setting.Digits
      numberSettings['data-step'] = setting.Step
      numberSettings['data-isPercentage'] = setting.ShowAsPercentage
      numberSettings['data-decimal'] = true
      numberSettings.max = setting.MaxValue
      numberSettings.min = setting.MinValue
      // TODO: currency
      return numberSettings
    })
    .setupFieldSettingDefault(IntegerFieldSetting, () => {
      return FieldControls.Number
    })
    .setClientControlFactory(IntegerFieldSetting, setting => {
      const numberSettings = clientConfigFactory(setting) as ReactNumberFieldSetting
      numberSettings['data-step'] = setting.Step
      numberSettings['data-isPercentage'] = setting.ShowAsPercentage
      numberSettings['data-decimal'] = false
      numberSettings.max = setting.MaxValue
      numberSettings.min = setting.MinValue
      // TODO: currency
      return numberSettings
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
    .setClientControlFactory(ShortTextFieldSetting, setting => {
      const shortTextSettings = clientConfigFactory(setting) as ReactShortTextFieldSetting
      shortTextSettings['data-minLength'] = setting.MinLength
      shortTextSettings['data-maxLength'] = setting.MaxLength
      shortTextSettings['data-regex'] = setting.Regex
      return shortTextSettings
    })
    .setupFieldSettingDefault(PasswordFieldSetting, () => {
      return FieldControls.Password
    })
    .setClientControlFactory(PasswordFieldSetting, setting => {
      const passwordSettings = clientConfigFactory(setting) as ReactShortTextFieldSetting
      return passwordSettings
    })
    .setupFieldSettingDefault(DateTimeFieldSetting, () => {
      return FieldControls.DateTimePicker
    })
    .setClientControlFactory(DateTimeFieldSetting, setting => {
      const dateTimeSettings = clientConfigFactory(setting) as ReactDateTimeFieldSetting
      dateTimeSettings['data-dateTimeMode'] = setting.DateTimeMode as any
      dateTimeSettings['data-precision'] = setting.Precision as any
      return dateTimeSettings
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
    .setClientControlFactory(ChoiceFieldSetting, setting => {
      const choiceSettings = clientConfigFactory(setting) as ReactChoiceFieldSetting
      choiceSettings['data-allowExtraValue'] = setting.AllowExtraValue
      choiceSettings['data-allowMultiple'] = setting.AllowMultiple
      choiceSettings.options = setting.Options || []
      return choiceSettings
    })
    .setupFieldSettingDefault(ReferenceFieldSetting, setting => {
      if (setting.AllowedTypes && setting.AllowedTypes.indexOf('User') !== -1 && setting.AllowMultiple) {
        return FieldControls.TagsInput
      } else {
        return FieldControls.ReferenceGrid
      }
    })
    .setClientControlFactory(ReferenceFieldSetting, setting => {
      const referenceSettings = clientConfigFactory(setting) as ReactReferenceFieldSetting
      referenceSettings['data-allowMultiple'] = setting.AllowMultiple
      referenceSettings['data-allowedTypes'] = setting.AllowedTypes
      referenceSettings['data-selectionRoot'] = setting.SelectionRoots
      referenceSettings.defaultValue = setting.DefaultValue
      referenceSettings['data-defaultDisplayName'] =
        setting.AllowedTypes !== undefined
          ? setting.AllowedTypes.indexOf('User') > -1
            ? 'FullName'
            : 'DisplayName'
          : 'DisplayName'
      return referenceSettings
    })
    .setupFieldSettingDefault(LongTextFieldSetting, setting => {
      switch (setting.TextType) {
        case 'LongText' as any:
          return FieldControls.Textarea
        case 'RichText' as any:
          return FieldControls.RichTextEditor
        case 'AdvancedRichText' as any:
          return FieldControls.RichTextEditor
        default:
          if (setting.ControlHint === 'sn:QueryBuilder') {
            return FieldControls.Textarea
          } else {
            return FieldControls.RichTextEditor
          }
      }
    })
    .setClientControlFactory(LongTextFieldSetting, setting => {
      const longTextSettings = clientConfigFactory(setting) as ReactLongTextFieldSetting
      longTextSettings['data-minLength'] = setting.MinLength
      longTextSettings['data-maxLength'] = setting.MaxLength
      return longTextSettings
    })
    .setupFieldSettingDefault(NullFieldSetting, setting => {
      if (setting.Name === 'Avatar') {
        return FieldControls.Avatar
      } else if (setting.Name === 'Color') {
        return FieldControls.ColorPicker
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
    .setClientControlFactory(NullFieldSetting, setting => {
      if (setting.SelectionRoots) {
        const avatarSettings = clientConfigFactory(setting) as ReactReferenceFieldSetting
        avatarSettings['data-selectionRoot'] = setting.SelectionRoots
        return avatarSettings
        // TODO: FIX this! this is probably not working
        // eslint-disable-next-line dot-notation
      } else if (setting['Palette']) {
        const colorPickerSettings = clientConfigFactory(setting) as ReactShortTextFieldSetting
        // eslint-disable-next-line dot-notation
        colorPickerSettings['palette'] = setting['Palette']
        return colorPickerSettings
      } else {
        const nullFieldSettings = clientConfigFactory(setting) as ReactClientFieldSetting
        return nullFieldSettings
      }
    })
    .setupFieldSettingDefault(BooleanFieldSetting, () => {
      return FieldControls.Boolean
    })
