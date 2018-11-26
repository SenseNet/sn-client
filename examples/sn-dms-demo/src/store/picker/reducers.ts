import { GenericContent } from '@sensenet/default-content-types'
import { createContent, PromiseReturns } from '@sensenet/redux/dist/Actions'
import { AnyAction, combineReducers, Reducer } from 'redux'
import { loadPickerItems, loadPickerParent } from './actions'

export const pickerIsOpened: Reducer<boolean> = (state: boolean = false, action: AnyAction) => {
    switch (action.type) {
        case 'OPEN_PICKER':
            return true
        case 'CLOSE_PICKER':
            return false
        default:
            return state
    }
}

export const pickerOnClose: Reducer<any> = (state: any = null, action: AnyAction) => {
    switch (action.type) {
        case 'OPEN_PICKER':
            return action.onClose
        case 'CLOSE_PICKER':
            return null
        default:
            return state
    }
}

export const pickerContent: Reducer<GenericContent | null> = (state: GenericContent | null = null, action: AnyAction) => {
    switch (action.type) {
        case 'OPEN_PICKER':
            return action.content
        case 'CLOSE_PICKER':
            return state
        default:
            return state
    }
}

export const pickerParent: Reducer<GenericContent | undefined> = (state: GenericContent | null = null, action: AnyAction) => {
    switch (action.type) {
        case 'SET_PICKER_PARENT':
            return action.content
        case 'LOAD_PICKER_PARENT_SUCCESS':
            const result = action.result as PromiseReturns<typeof loadPickerParent>
            return result.d
        default:
            return state
    }
}

export const pickerItems: Reducer<GenericContent[]> = (state: GenericContent[] = [], action: AnyAction) => {
    switch (action.type) {
        case 'LOAD_PICKER_ITEMS_SUCCESS':
            const result = (action.result as PromiseReturns<typeof loadPickerItems>).d.results
            return result.filter((item: GenericContent) => item.Id !== action.current.Id)
        case 'CREATE_CONTENT_SUCCESS':
            const newContent = (action.result as PromiseReturns<typeof createContent>).d
            return [...state, newContent]
        default:
            return state
    }
}

export const pickerSelected: Reducer<GenericContent[]> = (state: GenericContent[] = [], action: AnyAction) => {
    switch (action.type) {
        case 'SELECT_PICKER_ITEM':
            return action.content ? [action.content] : []
        case 'DESELECT_PICKER_ITEM':
            return []
        default:
            return state
    }
}

export const pickerMode: Reducer<string> = (state: string = 'move', action: AnyAction) => {
    switch (action.type) {
        case 'OPEN_PICKER':
            return action.mode
        default:
            return state
    }
}

export const closestWorkspace: Reducer<GenericContent | null> = (state: GenericContent | null = null, action: AnyAction) => {
    switch (action.type) {
        case 'SET_PICKER_PARENT':
            return action.content.Workspace.Path
        case 'LOAD_PICKER_PARENT_SUCCESS':
            const result = action.result as PromiseReturns<typeof loadPickerParent>
            return result && result.d.Workspace
        default:
            return state
    }
}

export const backLink: Reducer<boolean> = (state: boolean = true, action: AnyAction) => {
    switch (action.type) {
        case 'SET_BACKLINK':
            return action.state
        default:
            return state
    }
}

export const picker = combineReducers({
    isOpened: pickerIsOpened,
    pickerOnClose,
    content: pickerContent,
    parent: pickerParent,
    items: pickerItems,
    selected: pickerSelected,
    closestWorkspace,
    backLink,
    mode: pickerMode,
})
