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

export type FieldLocalization = DeepPartial<typeof defaultLocalization> & {
  richTextEditor?: LocalizationType
}
