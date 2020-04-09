import { ODataCollectionResponse, ODataParams } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { isFromAction } from '@sensenet/redux'
import { Reducer } from 'redux'
import {
  finishLoadingChildren,
  finishLoadingParent,
  resetSearchValues,
  select,
  setActive,
  setAncestors,
  setChildrenOptions,
  setError,
  setItems,
  setParent,
  startLoadingChildren,
  startLoadingParent,
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
    orderby: [
      ['IsFolder', 'desc'],
      ['DisplayName', 'asc'],
    ],
    filter: "ContentType ne 'SystemFolder'",
    scenario: 'ContextMenu',
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
      'Index',
      'Watermark',
      'RelatedDocuments',
    ] as any,
    expand: ['Actions', 'Owner', 'CheckedOutTo'],
    orderby: [
      ['IsFolder', 'desc'],
      ['DisplayName', 'asc'],
    ],
    filter: "ContentType ne 'SystemFolder'",
    scenario: 'ContextMenu',
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
  if (isFromAction(action, startLoadingParent)) {
    return {
      ...state,
      isLoadingParent: true,
      parentIdOrPath: action.idOrPath,
    }
  }
  if (isFromAction(action, finishLoadingParent)) {
    return {
      ...state,
      isLoadingParent: false,
    }
  }
  if (isFromAction(action, startLoadingChildren)) {
    return {
      ...state,
      isLoadingChildren: true,
      parentIdOrPath: action.idOrPath,
    }
  }
  if (isFromAction(action, finishLoadingChildren)) {
    return {
      ...state,
      isLoadingChildren: false,
    }
  }

  if (isFromAction(action, setParent)) {
    return {
      ...state,
      parent: action.content,
    }
  }
  if (isFromAction(action, setAncestors)) {
    return {
      ...state,
      ancestors: action.ancestors,
    }
  }
  if (isFromAction(action, setItems)) {
    return {
      ...state,
      items: action.items,
      selected: [
        ...state.selected.filter((s) =>
          action.items.d.results.find((i: GenericContent) => i.Id === s.Id) ? true : false,
        ),
      ],
    }
  }
  if (isFromAction(action, setError)) {
    return {
      ...state,
      error: action.error,
    }
  }
  if (isFromAction(action, select)) {
    return {
      ...state,
      selected: action.selected,
    }
  }
  if (isFromAction(action, setActive)) {
    return {
      ...state,
      active: action.active,
    }
  }
  if (isFromAction(action, setChildrenOptions)) {
    return {
      ...state,
      childrenOptions: {
        ...state.childrenOptions,
        ...action.odataOptions,
      },
    }
  }
  if (isFromAction(action, updateSearchValues)) {
    return {
      ...state,
      searchState: {
        ...state.searchState,
        ...action.value,
      },
    }
  }
  if (isFromAction(action, resetSearchValues)) {
    return {
      ...state,
      searchState: { ...defaultState.searchState },
    }
  }
  return state
}
