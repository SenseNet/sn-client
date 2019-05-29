import { GenericContent } from '@sensenet/default-content-types'

export const openPicker = (
  content: JSX.Element | React.Component | Element | null = null,
  mode: string = 'move',
  onClose?: () => void,
) => ({
  type: 'OPEN_PICKER',
  content,
  onClose: onClose || null,
  mode,
})

export const closePicker = () => ({
  type: 'CLOSE_PICKER',
})

export const setPickerParent = (content: GenericContent | null) => ({
  type: 'SET_PICKER_PARENT',
  content,
})

export const selectPickerItem = (content: GenericContent | null) => ({
  type: 'SELECT_PICKER_ITEM',
  content,
})

export const deselectPickeritem = () => ({
  type: 'DESELECT_PICKER_ITEM',
})

export const setBackLink = (state: boolean) => ({
  type: 'SET_BACKLINK',
  state,
})
