/**
 * @module sn-controls-react
 *
 *
 */

import { Repository } from '@sensenet/client-core'
import { ControlMapper } from '@sensenet/control-mapper'
import { ChoiceFieldSetting, DateTimeFieldSetting, FieldSetting, IntegerFieldSetting, LongTextFieldSetting, NumberFieldSetting, PasswordFieldSetting, ReferenceFieldSetting, ShortTextFieldSetting } from '@sensenet/default-content-types'
import { Component } from 'react'
import * as FieldControls from './fieldcontrols'
import { ReactChoiceFieldSetting } from './fieldcontrols/ChoiceFieldSetting'
import { ReactClientFieldSettingProps } from './fieldcontrols/ClientFieldSetting'
import { ReactDateTimeFieldSetting } from './fieldcontrols/DateTimeFieldSetting'
import { ReactLongTextFieldSetting } from './fieldcontrols/LongTextFieldSetting'
import { ReactNumberFieldSetting } from './fieldcontrols/Number/NumberFieldSetting'
import { ReactPasswordFieldSetting } from './fieldcontrols/Password/PasswordFieldSetting'
import { ReactReferenceFieldSetting } from './fieldcontrols/ReferenceFieldSetting'
import { ReactShortTextFieldSetting } from './fieldcontrols/ShortText/ShortTextFieldSetting'
import * as ViewControls from './viewcontrols'

/**
 * @description A client config instance, used to create a defaul mapping between the basic React props and sensenet ECM fields.
 */

const clientConfigFactory = (fieldSettings: FieldSetting) => {
    const defaultSetting = {} as ReactClientFieldSettingProps
    defaultSetting.key = fieldSettings.Name,
        defaultSetting.name = fieldSettings.Name,
        defaultSetting.readOnly = fieldSettings.ReadOnly || false,
        defaultSetting.required = fieldSettings.Compulsory || false,
        defaultSetting['data-placeHolderText'] = fieldSettings.DisplayName || ''
    defaultSetting['data-labelText'] = fieldSettings.DisplayName || '',
        defaultSetting['data-typeName'] = fieldSettings.Type || ''
    return defaultSetting
}

// const repository = new Repository()

/**
 * A static Control Mapper instance, used to create the mapping between sensenet ECM ContentTypes and FieldSettings and React components.
 */
export const reactControlMapper = (repository: Repository) => new ControlMapper(repository, Component, clientConfigFactory, ViewControls.EditView, FieldControls.ShortText)
    .setupFieldSettingDefault(NumberFieldSetting, (setting) => {
        return FieldControls.Number
    })
    .setClientControlFactory(NumberFieldSetting, (setting) => {
        const numberSettings = clientConfigFactory(setting) as ReactNumberFieldSetting
        numberSettings['data-digits'] = setting.Digits,
            numberSettings['data-step'] = setting.Step,
            numberSettings['data-isPercentage'] = setting.ShowAsPercentage,
            numberSettings['data-decimal'] = true,
            numberSettings.max = setting.MaxValue,
            numberSettings.min = setting.MinValue
        // TODO: currency
        return numberSettings
    })
    .setupFieldSettingDefault(IntegerFieldSetting, (setting) => {
        return FieldControls.Number
    })
    .setClientControlFactory(IntegerFieldSetting, (setting) => {
        const numberSettings = clientConfigFactory(setting) as ReactNumberFieldSetting
        numberSettings['data-step'] = setting.Step,
            numberSettings['data-isPercentage'] = setting.ShowAsPercentage,
            numberSettings['data-decimal'] = false,
            numberSettings.max = setting.MaxValue,
            numberSettings.min = setting.MinValue
        // TODO: currency
        return numberSettings
    })
    .setupFieldSettingDefault(ShortTextFieldSetting, (setting) => {
        switch (setting.ControlHint) {
            case 'sn:Name':
                return FieldControls.Name
            case 'sn:DisplayName':
                return FieldControls.DisplayName
            case 'sn:FileName':
                return FieldControls.FileName
            default:
                return FieldControls.ShortText
        }
    })
    .setClientControlFactory(ShortTextFieldSetting, (setting) => {
        const shortTextSettings = clientConfigFactory(setting) as ReactShortTextFieldSetting
        shortTextSettings['data-minLength'] = setting.MinLength,
            shortTextSettings['data-maxLength'] = setting.MaxLength,
            shortTextSettings['data-regex'] = setting.Regex
        return shortTextSettings
    })
    .setupFieldSettingDefault(PasswordFieldSetting, (setting) => {
        return FieldControls.Password
    })
    .setClientControlFactory(PasswordFieldSetting, (setting) => {
        const passwordSettings = clientConfigFactory(setting) as ReactPasswordFieldSetting
        return passwordSettings
    })
    .setupFieldSettingDefault(DateTimeFieldSetting, (setting) => {
        return FieldControls.DateTimePicker
    })
    .setClientControlFactory(DateTimeFieldSetting, (setting) => {
        const dateTimeSettings = clientConfigFactory(setting) as ReactDateTimeFieldSetting
        dateTimeSettings['data-dateTimeMode'] = setting.DateTimeMode as any,
            dateTimeSettings['data-precision'] = setting.Precision as any
        return dateTimeSettings
    })
    .setupFieldSettingDefault(ChoiceFieldSetting, (setting) => {
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
    .setClientControlFactory(ChoiceFieldSetting, (setting) => {
        const choiceSettings = clientConfigFactory(setting) as ReactChoiceFieldSetting
        choiceSettings['data-allowExtraValue'] = setting.AllowExtraValue,
            choiceSettings['data-allowMultiple'] = setting.AllowMultiple,
            choiceSettings.options = setting.Options
        return choiceSettings
    })
    .setupFieldSettingDefault(ReferenceFieldSetting, (setting) => {
        if (setting.AllowedTypes.indexOf('User') !== -1) {
            return FieldControls.TagsInput
        } else {
            // TODO: referencegrid
            return FieldControls.ShortText
        }
    })
    .setClientControlFactory(ReferenceFieldSetting, (setting) => {
        const referenceSettings = clientConfigFactory(setting) as ReactReferenceFieldSetting
        referenceSettings['data-allowMultiple'] = setting.AllowMultiple,
            referenceSettings['data-allowedTypes'] = setting.AllowedTypes,
            referenceSettings['data-selectionRoot'] = setting.SelectionRoots,
            referenceSettings['data-defaultDisplayName'] = setting.AllowedTypes.indexOf('User') > -1 ? 'FullName' : 'DisplayName'
        return referenceSettings
    })
    .setupFieldSettingDefault(LongTextFieldSetting, (setting) => {
        switch (setting.TextType) {
            case 'LongText' as any:
                return FieldControls.Textarea
            case 'RichText' as any:
                return FieldControls.RichTextEditor
            case 'AdvancedRichText' as any:
                return FieldControls.RichTextEditor
            default:
                return FieldControls.RichTextEditor
        }
    })
    .setClientControlFactory(LongTextFieldSetting, (setting) => {
        const longTextSettings = clientConfigFactory(setting) as ReactLongTextFieldSetting
        longTextSettings['data-minLength'] = setting.MinLength,
            longTextSettings['data-maxLength'] = setting.MaxLength
        return longTextSettings
    })
