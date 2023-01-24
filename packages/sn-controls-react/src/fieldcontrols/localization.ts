import { DeepPartial } from '@sensenet/client-utils'
import { LocalizationType } from '@sensenet/editor-react'

export const defaultLocalization = {
  allowedChildTypes: {
    noValue: 'No value set',
  },
  autoComplete: {
    noValue: 'No value set',
  },
  checkbox: {
    noValue: 'No value set',
  },
  checkboxGroup: {
    extraValuePlaceholder: 'Extra value',
    noValue: 'No value checked',
  },
  colorPicker: {
    noValue: 'No color selected',
  },
  datePicker: {
    noValue: 'No date selected',
  },
  dropdownList: {
    noValue: 'No value selected',
  },
  fileName: {
    noValue: 'No value set',
  },
  fileUpload: {
    buttonText: 'Upload',
    noValue: 'No file uploaded',
  },
  name: {
    invalidCharactersError: `The Name field can't contain these characters:`,
    noValue: 'No value set',
  },
  number: {
    noValue: 'No value set',
    pageCountValues: {
      '-1': 'No preview provider',
      '-2': 'Preview generation postponed',
      '-3': 'Preview error',
      '-4': 'Preview generation in progress',
      '-5': 'Preview generation in progress',
    },
  },
  password: {
    toggleVisibility: 'Toggle password visibility',
  },
  radioButtonGroup: {
    noValue: 'No item selected',
  },
  referenceGrid: {
    addReference: 'Add reference',
    changeReference: 'Change Reference',
    referencePickerTitle: 'Reference picker',
    okButton: 'Ok',
    cancelButton: 'Cancel',
    noValue: 'No reference selected',
  },
  richTextEditor: {
    loading: 'Loading the editor...',
    noValue: 'No value set',
  },
  shortText: {
    noValue: 'No value set',
  },
  switcher: {
    noValue: 'No value set',
  },
  tagsInput: {
    avatarAlt: (userName: string) => `The avatar of ${userName}`,
    noValue: 'No value set',
  },
  textarea: {
    noValue: 'No value set',
  },
  timePicker: {
    noValue: 'No time selected',
  },
  fileSize: {
    noValue: 'No value set',
  },
}

export type IPageCount = {
  [key in '-1' | '-2' | '-3' | '-4' | '-5']: string
}

export const pageCountValues: IPageCount = {}

export type FieldLocalization = DeepPartial<typeof defaultLocalization> & {
  richTextEditor?: LocalizationType
}
