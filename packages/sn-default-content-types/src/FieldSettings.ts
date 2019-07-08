/**
 * @module FieldSettings
 * @preferred
 *
 * @description Module for FieldSettings.
 *
 * FieldSetting object is the implementation of the configuration element in a Sense/Net Content Type Definition.
 * The FieldSetting of a Field contains properties that define the behavior of the Field - for example a Field can be configured as read only or compulsory to fill.
 * FieldSettings helps us to autogenerate type and schema TS files from Sense/Net CTDs and use these files to reach all the configuration options of the Content Types fields on
 * client-side e.g. for validation.
 *
 * This module also contains some FieldSetting related enums to use them as types in properties e.g. visibitily or datetime mode options.
 */

import * as ComplexTypes from './ComplexTypes'

/**
 * Enum for Field visibility values.
 */
export enum FieldVisibility {
  Show,
  Hide,
  Advanced,
}
/**
 * Enum for Field output method values.
 */
export enum OutputMethod {
  Default,
  Raw,
  Text,
  Html,
}
/**
 * Enum for Choice Field control values.
 */
export enum DisplayChoice {
  DropDown,
  RadioButtons,
  CheckBoxes,
}
/**
 * Enum for DateTime Field mode values.
 */
export enum DateTimeMode {
  None,
  Date,
  DateAndTime,
}
/**
 * Enum for DateTime Field precision values.
 */
export enum DateTimePrecision {
  Millisecond,
  Second,
  Minute,
  Hour,
  Day,
}
/**
 * Type for LongText field editor values.
 */
export type TextType = 'LongText' | 'RichText' | 'AdvancedRichText'

/**
 * Enum for HyperLink field href values.
 */
export enum UrlFormat {
  Hyperlink,
  Picture,
}

/**
 * Check if field setting is type of param
 * @template T
 * @param {FieldSetting} setting
 * @param {new () => T} type
 */
export function isFieldSettingOfType<T extends FieldSetting>(setting: FieldSetting, type: new () => T): setting is T {
  return setting.Type === type.name
}

export class FieldSetting {
  public Name!: string
  public Type!: string
  public FieldClassName!: string
  public DisplayName?: string
  public Description?: string
  public Icon?: string
  public ReadOnly?: boolean
  public Compulsory?: boolean
  public DefaultValue?: string
  public OutputMethod?: OutputMethod
  public Visible?: boolean
  public VisibleBrowse?: FieldVisibility
  public VisibleNew?: FieldVisibility
  public VisibleEdit?: FieldVisibility
  public FieldIndex?: number
  public DefaultOrder?: number
  public ControlHint?: string
}

// Used in ContentType, GenericContent, File, Image, TrashBag, TrashBin, Task
export class IntegerFieldSetting extends FieldSetting {
  public MinValue?: number
  public MaxValue?: number
  public ShowAsPercentage?: boolean
  public Step?: number
}

//
export class TextFieldSetting extends FieldSetting {
  public MinLength?: number
  public MaxLength?: number
}

// Used in ContentType, GenericContent, File, ContentList, Device, Domain, Email, OrganizationalUnit, TrashBag, Group, Task, User
export class ShortTextFieldSetting extends TextFieldSetting {
  public Regex?: string
}

// Used in ContentType, GenericContent, Settings, IndexingSettings, ContentList, Workspace, Site, CustomListItem, User
export class NullFieldSetting extends FieldSetting {
  public SelectionRoots?: string[]
}

// Used in ContentType, GenericContent, File, HtmlTemplate, Image, ContentList, Aspect, Email, SmartFolder, Query, User
export class LongTextFieldSetting extends TextFieldSetting {
  public Rows?: number
  public TextType?: TextType
  public AppendModifications?: boolean
}

// Used in ContentType, File, User
export class BinaryFieldSetting extends FieldSetting {
  public IsText?: boolean
}

// Used in ContentType, GenericContent, ContentLink, ContentList, ImageLibrary, TrashBag, Workspace, Site, UserProfile, Group, Memo, Task, User
export class ReferenceFieldSetting extends FieldSetting {
  public AllowMultiple?: boolean
  public AllowedTypes?: string[]
  public SelectionRoots?: string[]
  public Query?: string /* original: ContentQuery */
  public FieldName?: string
}

// Used in ContentType, GenericContent, Image, Domain, Email, OrganizationalUnit, TrashBag, Workspace, Group, Memo, Task, User
export class DateTimeFieldSetting extends FieldSetting {
  public DateTimeMode?: DateTimeMode
  public Precision?: DateTimePrecision
}

// Used in GenericContent, ContentList, SmartFolder, Site, Memo, Task, Query, User
export class ChoiceFieldSetting extends ShortTextFieldSetting {
  public AllowExtraValue?: boolean
  public AllowMultiple?: boolean
  public Options?: ComplexTypes.ChoiceOption[]
  public DisplayChoice?: DisplayChoice
  public EnumTypeName?: string
}

// Used in GenericContent, File, Resource
export class NumberFieldSetting extends FieldSetting {
  public MinValue?: number
  public MaxValue?: number
  public Digits?: number
  public ShowAsPercentage?: boolean
  public Step?: number
}

// Used in GenericContent
export class RatingFieldSetting extends ShortTextFieldSetting {
  public Range?: number
  public Split?: number
}

// Used in User
export class PasswordFieldSetting extends ShortTextFieldSetting {
  public ReenterTitle?: string
  public ReenterDescription?: string
  public PasswordHistoryLength?: number
}

export class ColorFieldSetting extends TextFieldSetting {
  /**
   * Semicolon separated list of colors in hexadecimal format.
   * @example "#ff0000;#f0d0c9;#e2a293;#d4735e;#65281a"
   * @type {string}
   * @memberof ColorFieldSetting
   */
  public Palette?: string
}
// Used in User
export class CaptchaFieldSetting extends FieldSetting {}

export class BooleanFieldSetting extends FieldSetting {}

export class CurrencyFieldSetting extends NumberFieldSetting {
  /**
   * Provides region information for specific cultures
   * @type {string}
   * @example 'en-US'
   * @memberof CurrencyFieldSetting
   */
  public Format?: string
}
