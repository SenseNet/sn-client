import { ODataCollectionResponse, ODataParams } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { Reducer } from 'redux'
import {
  select,
  setActive,
  setAncestors,
  setError,
  setItems,
  setParent,
  startLoadingChildren,
  startLoadingParent,
  updateChildrenOptions,
  updateSearchValues,
} from './actions'

export interface DocumentLibraryState {
  parent?: GenericContent
  ancestors: GenericContent[]
  parentIdOrPath?: string | number
  items: ODataCollectionResponse<GenericContent>
  isLoadingParent: boolean
  isLoadingChildren: boolean
  error?: any
  selected: GenericContent[]
  active?: GenericContent
  parentOptions: ODataParams<GenericContent>
  childrenOptions: ODataParams<GenericContent>
  searchState: {
    searchString: string
    type: string
    owner: string
    sharedWith: string
    itemName: string
    dateModified: string
    contains: string
    rootPath: string
  }
}

export const loadChunkSize = 25

export const defaultState: DocumentLibraryState = {
  isLoadingParent: false,
  isLoadingChildren: false,
  items: { d: { __count: 0, results: [] } },
  selected: [],
  ancestors: [],
  parentOptions: {
    select: [
      'Id',
      'Path',
      'DisplayName',
      'ModificationDate',
      'Type',
      'Icon',
      'IsFolder',
      'Actions',
      'Owner',
      'VersioningMode',
      'ParentId',
      'Workspace',
    ],
    expand: ['Actions', 'Owner', 'Workspace'],
    orderby: [['IsFolder', 'desc'], ['DisplayName', 'asc']],
    filter: "ContentType ne 'SystemFolder'",
    scenario: 'DMSListItem',
  },
  childrenOptions: {
    select: [
      'Id',
      'Path',
      'DisplayName',
      'ModificationDate',
      'Type',
      'Icon',
      'IsFolder',
      'Actions',
      'Owner',
      'VersioningMode',
      'ParentId',
      'CheckedOutTo',
      'Approvable',
    ],
    expand: ['Actions', 'Owner', 'CheckedOutTo'],
    orderby: [['IsFolder', 'desc'], ['DisplayName', 'asc']],
    filter: "ContentType ne 'SystemFolder'",
    scenario: 'DMSListItem',
    top: loadChunkSize,
  },
  searchState: {
    contains: '',
    dateModified: '',
    itemName: '',
    owner: '',
    rootPath: '',
    searchString: '',
    sharedWith: '',
    type: '',
  },
}

export const documentLibrary: Reducer<DocumentLibraryState> = (state = defaultState, action) => {
  switch (action.type) {
    case 'DMS_DOCLIB_LOADING_PARENT':
      return {
        ...state,
        isLoadingParent: true,
        parentIdOrPath: (action as ReturnType<typeof startLoadingParent>).idOrPath,
      }
    case 'DMS_DOCLIB_FINISH_LOADING_PARENT':
      return {
        ...state,
        isLoadingParent: false,
      }
    case 'DMS_DOCLIB_LOADING_CHILDREN':
      return {
        ...state,
        isLoadingChildren: true,
        parentIdOrPath: (action as ReturnType<typeof startLoadingChildren>).idOrPath,
      }
    case 'DMS_DOCLIB_FINISH_LOADING_CHILDREN':
      return {
        ...state,
        isLoadingChildren: false,
      }
    case 'DMS_DOCLIB_SET_PARENT':
      return {
        ...state,
        parent: (action as ReturnType<typeof setParent>).content,
      }
    case 'DMS_DOCLIB_SET_ANCESTORS':
      return {
        ...state,
        ancestors: (action as ReturnType<typeof setAncestors>).ancestors,
      }
    case 'DMS_DOCLIB_SET_ITEMS':
      return {
        ...state,
        items: (action as ReturnType<typeof setItems>).items,
        selected: [
          ...state.selected.filter(s =>
            action.items.d.results.find((i: GenericContent) => i.Id === s.Id) ? true : false,
          ),
        ],
      }
    case 'DMS_DOCLIB_SET_ERROR':
      return {
        ...state,
        error: (action as ReturnType<typeof setError>).error,
      }
    case 'DMS_DOCLIB_SELECT':
      return {
        ...state,
        selected: (action as ReturnType<typeof select>).selected,
      }
    case 'DMS_DOCLIB_SET_ACTIVE':
      return {
        ...state,
        active: (action as ReturnType<typeof setActive>).active,
      }
    case 'DMS_DOCLIB_SET_CHILDREN_OPTIONS':
      return {
        ...state,
        childrenOptions: {
          ...state.childrenOptions,
          ...(action as ReturnType<typeof updateChildrenOptions>).odataOptions,
        },
      }
    case 'DMS_DOCLIB_UPDATE_SEARCH_STATE':
      return {
        ...state,
        searchState: {
          ...state.searchState,
          ...(action as ReturnType<typeof updateSearchValues>).value,
        },
      }
  }
  return state
}
