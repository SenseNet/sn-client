/**
 * @module sn-controls-react
 * 
 * 
 */ 

import * as React from 'react'
import { ControlMapper, FieldSettings, Repository } from 'sn-client-js';
import { ReactClientFieldConfig } from './ReactClientFieldConfig';
import * as ViewControls from './viewcontrols'
import * as FieldControls from './fieldcontrols'
import { IClientFieldSetting, IReactClientFieldSetting } from './fieldcontrols/IClientFieldSetting'
import { IShortTextFieldSetting } from './fieldcontrols/ShortText/IShortTextFieldSetting'
import { IDisplayNameFieldSetting } from './fieldcontrols/DisplayName/IDisplayNameFieldSetting'
import { INumberFieldSetting } from './fieldcontrols/Number/INumberFieldSetting'
import { IChoiceFieldSetting } from './fieldcontrols/IChoiceFieldSetting'
import { IDateTimeFieldSetting } from './fieldcontrols/IDateTimeFieldSetting'
import { IReferenceFieldSetting } from './fieldcontrols/IReferenceFieldSetting'
import { ILongTextFieldSetting } from './fieldcontrols/ILongTextFieldSetting'
import { ITextareaFieldSetting } from './fieldcontrols/Textarea/ITextareaFieldSetting'
import { IRichTextEditorFieldSetting } from './fieldcontrols/RichTextEditor/IRichTextEditorFieldSetting'
import { IPasswordFieldSetting } from './fieldcontrols/Password/IPasswordFieldSetting'

/**
 * @description A client config instance, used to create a defaul mapping between the basic React props and sensenet ECM fields.
 */

const clientConfigFactory = (fieldSettings: FieldSettings.FieldSetting) => {
    const defaultSetting = {} as IReactClientFieldSetting;
    defaultSetting.key = fieldSettings.Name,
        defaultSetting.name = fieldSettings.Name,
        defaultSetting.readOnly = fieldSettings.ReadOnly || false,
        defaultSetting.required = fieldSettings.Compulsory || false,
        defaultSetting['data-placeHolderText'] = fieldSettings.DisplayName || ''
    defaultSetting['data-labelText'] = fieldSettings.DisplayName || ''
    return defaultSetting;
}

const repository = new Repository.SnRepository();

/**
 * @description A static Control Mapper instance, used to create the mapping between sensenet ECM ContentTypes and FieldSettings and React components.
 */

export const ReactControlMapper = new ControlMapper(repository, React.Component, clientConfigFactory, ViewControls.EditView, FieldControls.ShortText)
    .SetupFieldSettingDefault(FieldSettings.NumberFieldSetting, (setting) => {
        return FieldControls.Number;
    })
    .SetClientControlFactory(FieldSettings.NumberFieldSetting, (setting) => {
        const numberSettings = clientConfigFactory(setting) as INumberFieldSetting;
        numberSettings['data-digits'] = setting.Digits,
            numberSettings['data-step'] = setting.Step,
            numberSettings['data-isPercentage'] = setting.ShowAsPercentage,
            numberSettings['data-decimal'] = true,
            numberSettings.max = setting.MaxValue,
            numberSettings.min = setting.MinValue
        // TODO: currency
        return numberSettings;
    })
    .SetupFieldSettingDefault(FieldSettings.IntegerFieldSetting, (setting) => {
        return FieldControls.Number;
    })
    .SetClientControlFactory(FieldSettings.IntegerFieldSetting, (setting) => {
        const numberSettings = clientConfigFactory(setting) as INumberFieldSetting;
        numberSettings['data-step'] = setting.Step,
            numberSettings['data-isPercentage'] = setting.ShowAsPercentage,
            numberSettings['data-decimal'] = false,
            numberSettings.max = setting.MaxValue,
            numberSettings.min = setting.MinValue
        // TODO: currency
        return numberSettings;
    })
    .SetupFieldSettingDefault(FieldSettings.ShortTextFieldSetting, (setting) => {
        switch (setting.ControlHint) {
            case 'sn:Name':
                return FieldControls.Name
            case 'sn:DisplayName':
                return FieldControls.DisplayName
            default:
                return FieldControls.ShortText
        }
    })
    .SetClientControlFactory(FieldSettings.ShortTextFieldSetting, (setting) => {
        const shortTextSettings = clientConfigFactory(setting) as IShortTextFieldSetting;
        shortTextSettings['data-minLength'] = setting.MinLength,
            shortTextSettings['data-maxLength'] = setting.MaxLength,
            shortTextSettings['data-regex'] = setting.Regex
        return shortTextSettings;
    })
    .SetupFieldSettingDefault(FieldSettings.PasswordFieldSetting, (setting) => {
        return FieldControls.Password
    })
    .SetClientControlFactory(FieldSettings.PasswordFieldSetting, (setting) => {
        const passwordSettings = clientConfigFactory(setting) as IPasswordFieldSetting;
        return passwordSettings;
    })
    .SetupFieldSettingDefault(FieldSettings.DateTimeFieldSetting, (setting) => {
        return FieldControls.DatePicker;
    })
    .SetClientControlFactory(FieldSettings.DateTimeFieldSetting, (setting) => {
        const dateTimeSettings = clientConfigFactory(setting) as IDateTimeFieldSetting;
        dateTimeSettings['data-dateTimeMode'] = setting.DateTimeMode as any,
            dateTimeSettings['data-precision'] = setting.Precision as any
        return dateTimeSettings;
    })
    .SetupFieldSettingDefault(FieldSettings.ChoiceFieldSetting, (setting) => {
        switch (setting.DisplayChoice) {
            case 2:
                return FieldControls.CheckboxGroup;
            case 0:
                return FieldControls.DropDownList;
            case 1:
                return FieldControls.RadioButtonGroup;
            default:
                if (setting.AllowMultiple) {
                    return FieldControls.CheckboxGroup;
                }
                else {
                    return FieldControls.DropDownList;
                }
        }
    })
    .SetClientControlFactory(FieldSettings.ChoiceFieldSetting, (setting) => {
        const choiceSettings = clientConfigFactory(setting) as IChoiceFieldSetting;
        choiceSettings['data-allowExtraValue'] = setting.AllowExtraValue,
            choiceSettings['data-allowMultiple'] = setting.AllowMultiple,
            choiceSettings.options = setting.Options
        return choiceSettings;
    })
    .SetupFieldSettingDefault(FieldSettings.ReferenceFieldSetting, (setting) => {
        if (setting.AllowedTypes.indexOf('User') !== -1) {
            return FieldControls.TagsInput
        }
        else {
            // TODO: referencegrid
            return FieldControls.ShortText
        }
    })
    .SetClientControlFactory(FieldSettings.ReferenceFieldSetting, (setting) => {
        const referenceSettings = clientConfigFactory(setting) as IReferenceFieldSetting;
        referenceSettings['data-allowMultiple'] = setting.AllowMultiple,
            referenceSettings['data-allowedTypes'] = setting.AllowedTypes,
            referenceSettings['data-selectionRoot'] = setting.SelectionRoots
        return referenceSettings;
    })
    .SetupFieldSettingDefault(FieldSettings.LongTextFieldSetting, (setting) => {
        switch (setting.TextType) {
            case 'LongText' as any:
                return FieldControls.Textarea;
            case 'RichText' as any:
                return FieldControls.RichTextEditor;
            case 'AdvancedRichText' as any:
                return FieldControls.RichTextEditor;
            default:
                return FieldControls.RichTextEditor;
        }
    })
    .SetClientControlFactory(FieldSettings.LongTextFieldSetting, (setting) => {
        const longTextSettings = clientConfigFactory(setting) as ILongTextFieldSetting;
        longTextSettings['data-minLength'] = setting.MinLength,
            longTextSettings['data-maxLength'] = setting.MaxLength
        return longTextSettings;
    });