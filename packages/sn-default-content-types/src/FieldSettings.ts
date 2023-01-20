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
  DropDown = 'DropDown',
  RadioButtons = 'RadioButtons',
  CheckBoxes = 'CheckBoxes',
}
/**
 * Enum for DateTime Field mode values.
 */
export enum DateTimeMode {
  None = 'None',
  Date = 'Date',
  DateAndTime = 'DateAndTime',
}
/**
 * Enum for DateTime Field precision values.
 */
export enum DateTimePrecision {
  Millisecond = 'Millisecond',
  Second = 'Second',
  Minute = 'Minute',
  Hour = 'Hour',
  Day = 'Day',
}
/**
 * Type for LongText field editor values.
 */
export type TextType = 'LongText' | 'RichText' | 'AdvancedRichText'

/**
 * Check if field setting is type of param
 * @template T
 * @param {FieldSetting} setting
 * @param {new () => T} type
 */
export function isFieldSettingOfType<T extends FieldSetting>(setting: FieldSetting, type: new () => T): setting is T {
  return setting.Type === type.name
}

export type FieldSetting = {
  Name: string
  Type: string
  FieldClassName: string
  DisplayName?: string
  Description?: string
  Icon?: string
  ReadOnly?: boolean
  Compulsory?: boolean
  DefaultValue?: string
  OutputMethod?: OutputMethod
  VisibleBrowse?: FieldVisibility
  VisibleNew?: FieldVisibility
  VisibleEdit?: FieldVisibility
  FieldIndex?: number
  ControlHint?: string
}

// Used in ContentType, GenericContent, File, Image, TrashBag, TrashBin, Task
export type IntegerFieldSetting = FieldSetting & {
  MinValue?: number
  MaxValue?: number
  ShowAsPercentage?: boolean
  Step?: number
}

export type TextFieldSetting = FieldSetting & {
  MinLength?: number
  MaxLength?: number
}

// Used in ContentType, GenericContent, File, ContentList, Device, Domain, Email, OrganizationalUnit, TrashBag, Group, Task, User
export type ShortTextFieldSetting = TextFieldSetting & {
  Regex?: string
}

// Used in ContentType, GenericContent, Settings, IndexingSettings, ContentList, Workspace, Site, CustomListItem, User
export type NullFieldSetting = FieldSetting & {
  SelectionRoots?: string[]
}

// Used in ContentType, GenericContent, File, HtmlTemplate, Image, ContentList, Aspect, Email, SmartFolder, Query, User
export type LongTextFieldSetting = TextFieldSetting & {
  Rows?: number
  TextType?: TextType
  AppendModifications?: boolean
}

export type RichTextFieldSetting = TextFieldSetting

// Used in ContentType, File, User
export type BinaryFieldSetting = FieldSetting & {
  IsText?: boolean
}

// Used in ContentType, GenericContent, ContentLink, ContentList, ImageLibrary, TrashBag, Workspace, Site, UserProfile, Group, Memo, Task, User
export type ReferenceFieldSetting = FieldSetting & {
  AllowMultiple?: boolean
  AllowedTypes?: string[]
  SelectionRoots?: string[]
  Query?: string /* original: ContentQuery */
  FieldName?: string
}

// Used in ContentType, GenericContent, Image, Domain, Email, OrganizationalUnit, TrashBag, Workspace, Group, Memo, Task, User
export type DateTimeFieldSetting = FieldSetting & {
  DateTimeMode?: DateTimeMode
  Precision?: DateTimePrecision
  EvaluatedDefaultValue?: string
  DateTimeFormat?: string
}

// Used in GenericContent, ContentList, SmartFolder, Site, Memo, Task, Query, User
export type ChoiceFieldSetting = ShortTextFieldSetting & {
  AllowExtraValue?: boolean
  AllowMultiple?: boolean
  Options?: ComplexTypes.ChoiceOption[]
  DisplayChoice?: DisplayChoice
  EnumTypeName?: string
}

// Used in GenericContent, File, Resource
export type NumberFieldSetting = FieldSetting & {
  MinValue?: number
  MaxValue?: number
  Digits?: number
  ShowAsPercentage?: boolean
  Step?: number
}

// Used in GenericContent
export type RatingFieldSetting = ShortTextFieldSetting & {
  Range?: number
  Split?: number
}

// Used in User
export type PasswordFieldSetting = ShortTextFieldSetting & {
  ReenterTitle?: string
  ReenterDescription?: string
  PasswordHistoryLength?: number
}

export type ColorFieldSetting = TextFieldSetting & {
  /**
   * Semicolon separated list of colors in hexadecimal format.
   * @example "#ff0000;#f0d0c9;#e2a293;#d4735e;#65281a"
   * @type {string}
   * @memberof ColorFieldSetting
   */
  Palette?: string
}
// Used in User
export type CaptchaFieldSetting = FieldSetting

export type BooleanFieldSetting = FieldSetting

export type CurrencyFieldSetting = NumberFieldSetting & {
  /**
   * Provides region information for specific cultures
   * @type {string}
   * @example 'en-US'
   * @memberof CurrencyFieldSetting
   */
  Format?: string
}
