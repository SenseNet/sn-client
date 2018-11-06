import { IODataCollectionResponse, IODataParams } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { Reducer } from 'redux'
import { select, setActive, setAncestors, setError, setItems, setParent, startLoading, updateChildrenOptions } from './actions'

export interface DocumentLibraryState {
    parent?: GenericContent
    ancestors: GenericContent[]
    parentIdOrPath?: string | number,
    items: IODataCollectionResponse<GenericContent>
    isLoading: boolean
    error?: any
    selected: GenericContent[]
    active?: GenericContent
    parentOptions: IODataParams<GenericContent>
    childrenOptions: IODataParams<GenericContent>
}

export const loadChunkSize = 25

export const defaultState: DocumentLibraryState = {
    isLoading: true,
    items: { d: { __count: 0, results: [] } },
    selected: [],
    ancestors: [],
    parentOptions: {
        select: ['Id', 'Path', 'DisplayName', 'ModificationDate', 'Type', 'Icon', 'IsFolder', 'Actions', 'Owner', 'VersioningMode', 'ParentId', 'Workspace'],
        expand: ['Actions', 'Owner', 'Workspace'],
        orderby: [['IsFolder', 'desc'], ['DisplayName', 'asc']],
        filter: 'ContentType ne \'SystemFolder\'',
        scenario: 'DMSListItem',
    },
    childrenOptions: {
        select: ['Id', 'Path', 'DisplayName', 'ModificationDate', 'Type', 'Icon', 'IsFolder', 'Actions', 'Owner', 'VersioningMode', 'ParentId', 'CheckedOutTo', 'Approvable'],
        expand: ['Actions', 'Owner', 'CheckedOutTo'],
        orderby: [['IsFolder', 'desc'], ['DisplayName', 'asc']],
        filter: 'ContentType ne \'SystemFolder\'',
        scenario: 'DMSListItem',
        top: loadChunkSize,
    },
}

export const documentLibrary: Reducer<DocumentLibraryState> = (state = defaultState, action) => {
    switch (action.type) {
        case 'DMS_DOCLIB_LOADING':
            return {
                ...state,
                isLoading: true,
                parentIdOrPath: (action as ReturnType<typeof startLoading>).idOrPath,
            }
        case 'DMS_DOCLIB_FINISH_LOADING':
            return {
                ...state,
                isLoading: false,
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
                selected: [...state.selected.filter((s) => action.items.d.results.find((i) => i.Id === s.Id) ? true : false)],
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

    }
    return state
}
