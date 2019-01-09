import { ODataParams, Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'

const pickerParentOptions: ODataParams<GenericContent> = {
  select: ['DisplayName', 'Path', 'Id', 'ParentId', 'Workspace'],
  expand: ['Workspace'],
  metadata: 'no',
}

const pickerItemOptions: ODataParams<any> = {
  select: ['DisplayName', 'Path', 'Id', 'Children'],
  expand: ['Children'],
  // tslint:disable-next-line:quotemark
  filter: "isOf('Folder')",
  metadata: 'no',
  orderby: 'DisplayName',
}

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

export const loadPickerParent = (idOrPath: string | number) => ({
  type: 'LOAD_PICKER_PARENT',
  payload: (repository: Repository) =>
    repository.load({
      idOrPath,
      oDataOptions: pickerParentOptions,
    }),
})

export const loadPickerItems = (path: string, options?: ODataParams<any>) => ({
  type: 'LOAD_PICKER_ITEMS',
  payload: (repository: Repository) =>
    repository.loadCollection({
      path,
      oDataOptions: { ...pickerItemOptions, ...options } as any,
    }),
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
