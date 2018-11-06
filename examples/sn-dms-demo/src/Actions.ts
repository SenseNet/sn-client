import { IContent, IUploadFromEventOptions, IUploadFromFileListOptions, IUploadProgressInfo, Repository, Upload } from '@sensenet/client-core'
import { ObservableValue, usingAsync } from '@sensenet/client-utils'
import { File as SnFile, GenericContent } from '@sensenet/default-content-types'
import { IActionModel } from '@sensenet/default-content-types/dist/IActionModel'
import { Action, AnyAction, Dispatch } from 'redux'

import { InjectableAction } from 'redux-di-middleware'
import { rootStateType } from '.'
import { updateChildrenOptions } from './store/documentlibrary/actions'

// tslint:disable-next-line:no-var-requires
import * as debounce from 'lodash.debounce'

export enum MessageMode { error = 'error', warning = 'warning', info = 'info' }

export const userRegistration = (email: string, password: string) => ({
    type: 'USER_REGISTRATION_REQUEST',
    email,
    password,
    async payload(repository: Repository) {
        return await repository.executeAction({
            name: 'RegisterUser', idOrPath: `/Root/IMS('Public')`, body: {
                email,
                password,
            }, method: 'POST',
        })
    },
})
export const verifyCaptchaSuccess = () => ({
    type: 'VERIFY_CAPTCHA_SUCCESS',
})
export const clearRegistration = () => ({
    type: 'CLEAR_USER_REGISTRATION',
})
export const setCurrentId = (id: number | string) => ({
    type: 'SET_CURRENT_ID',
    id,
})
export const setEditedContentId = (id: number) => ({
    type: 'SET_EDITED_ID',
    id,
})
export const openActionMenu = (actions: IActionModel[], content: GenericContent, title: string, element: HTMLElement, position?: any, customItems?: any) => ({
    type: 'OPEN_ACTIONMENU',
    actions: customItems && customItems.length > 0 ? customItems : actions,
    content,
    title,
    element,
    position,
})
export const closeActionMenu = () => ({
    type: 'CLOSE_ACTIONMENU',
})
export const selectionModeOn = () => ({
    type: 'SELECTION_MODE_ON',
})
export const selectionModeOff = () => ({
    type: 'SELECTION_MODE_OFF',
})
export const setEditedFirst = (edited: boolean) => ({
    type: 'SET_EDITED_FIRST',
    edited,
})

export const getListActions = (idOrPath: number | string, scenario?: string, customActions?: IActionModel[]) => ({
    type: 'GET_LIST_ACTIONS',
    async inject(options) {
        const actionsState = options.getState().dms.toolbar
        if (!actionsState.isLoading && (actionsState.idOrPath !== idOrPath || actionsState.scenario !== scenario)) {
            options.dispatch(loadListActions(idOrPath, scenario))
            const repository = options.getInjectable(Repository)
            const data: { d: { Actions: IActionModel[] } } = await repository.getActions({ idOrPath, scenario }) as any
            const actions = customActions ? [...data.d.Actions, ...customActions] : data.d.Actions
            const ordered = actions.sort((a, b) => {
                const x = a.Index
                const y = b.Index
                return ((x < y) ? -1 : ((x > y) ? 1 : 0))
            })
            options.dispatch(setListActions(ordered))
        }
    },
} as InjectableAction<rootStateType, AnyAction>)

export const loadListActions = (idOrPath: number | string, scenario?: string) => ({
    type: 'LOAD_LIST_ACTIONS',
    idOrPath,
    scenario,
})

export const setListActions = (actions: IActionModel[]) => ({
    type: 'SET_LIST_ACTIONS',
    actions,
})
export const loadUserActions = (idOrPath: number | string, scenario?: string, customActions?: IActionModel[]) => ({
    type: 'LOAD_USER_ACTIONS',
    async payload(repository: Repository) {
        const data: { d: { Actions: IActionModel[] } } = await repository.getActions({ idOrPath, scenario }) as any
        const actions = customActions ? [...data.d.Actions, ...customActions] : data.d.Actions
        return {
            d: {
                Actions: actions.sort((a: IActionModel, b: IActionModel) => {
                    const x = a.Index
                    const y = b.Index
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0))
                }),
            },
        }
    },
})

export type ExtendedUploadProgressInfo = IUploadProgressInfo & { content?: GenericContent, visible?: boolean }

export const changedContent: GenericContent[] = []

function methodToDebounce(getState: () => rootStateType, dispatch: Dispatch) {
    const currentContent = getState().dms.documentLibrary.parent
    changedContent.forEach((content) => {
        if (currentContent && currentContent.Id === content.ParentId) {
            dispatch(updateChildrenOptions({}))
            changedContent.length = 0
            return
        }
    })
}
export const debounceReloadOnProgress = debounce(methodToDebounce, 300)

export const trackUploadProgress = async <T extends GenericContent>(currentValue: ExtendedUploadProgressInfo, getState: () => rootStateType, dispatch: Dispatch, api: Repository) => {

    let currentUpload: ExtendedUploadProgressInfo | undefined = getState().dms.uploads.uploads.find((u) => u.guid === currentValue.guid)
    if (currentUpload) {
        dispatch(updateUploadItem(currentValue))
    } else {
        dispatch(addUploadItem({
            ...currentValue,
            visible: true,
        }))
    }

    currentUpload = getState().dms.uploads.uploads.find((u) => u.guid === currentValue.guid)
    if (currentUpload && currentValue.createdContent && !currentUpload.content) {
        const content = await api.load<T>({
            idOrPath: currentValue.createdContent.Id,
            oDataOptions: {
                ...getState().dms.documentLibrary.childrenOptions,
            },
        })
        dispatch(updateUploadItem({ ...currentValue, content: content.d }))
        changedContent.push(content.d)
        debounceReloadOnProgress(getState, dispatch)
    }
}

export const uploadFileList: <T extends SnFile>(uploadOptions: Pick<IUploadFromFileListOptions<T>, Exclude<keyof IUploadFromFileListOptions<T>, 'repository'>>) => InjectableAction<rootStateType, Action> =
    <T extends SnFile>(uploadOptions: Pick<IUploadFromFileListOptions<T>, Exclude<keyof IUploadFromFileListOptions<T>, 'repository'>>) => ({
        type: 'DMS_UPLOAD_FILE_LIST_INJECTABLE_ACTION',
        inject: async (options) => {
            const api = options.getInjectable(Repository)
            await usingAsync(new ObservableValue<IUploadProgressInfo>(), async (progress) => {
                progress.subscribe(async (currentValue) => trackUploadProgress(currentValue, options.getState, options.dispatch, api))
                try {
                    await Upload.fromFileList({
                        ...uploadOptions,
                        repository: api,
                        progressObservable: progress,
                    })
                } catch (error) {
                    progress.setValue({
                        ...progress.getValue(),
                        error,
                    })
                }
            })
        },
    })

export const uploadDataTransfer: <T extends SnFile>(options: Pick<IUploadFromEventOptions<T>, Exclude<keyof IUploadFromEventOptions<T>, 'repository'>>) => InjectableAction<rootStateType, Action>
    = <T extends SnFile>(uploadOptions: Pick<IUploadFromEventOptions<T>, Exclude<keyof IUploadFromEventOptions<T>, 'repository'>>) => ({
        type: 'DMS_UPLOAD_DATA_TRANSFER_INJECTABLE_ACTION',
        inject: async (options) => {
            const api = options.getInjectable(Repository)
            await usingAsync(new ObservableValue<IUploadProgressInfo>(), async (progress) => {
                progress.subscribe(async (currentValue) => trackUploadProgress(currentValue, options.getState, options.dispatch, api))
                try {
                    await Upload.fromDropEvent({
                        ...uploadOptions,
                        repository: api,
                        progressObservable: progress,
                    })
                } catch (error) {
                    progress.setValue({
                        ...progress.getValue(),
                        error,
                    })
                }
            })
        },
    })

export const addUploadItem = <T extends IContent>(uploadItem: ExtendedUploadProgressInfo) => ({
    type: 'UPLOAD_ADD_ITEM',
    uploadItem,
})

export const updateUploadItem = (uploadItem: ExtendedUploadProgressInfo) => ({
    type: 'UPLOAD_UPDATE_ITEM',
    uploadItem,
})

export const removeUploadItem = (uploadItem: ExtendedUploadProgressInfo) => ({
    type: 'UPLOAD_REMOVE_ITEM',
    uploadItem,
})

export const hideUploadItem = (uploadItem: ExtendedUploadProgressInfo) => ({
    type: 'UPLOAD_HIDE_ITEM',
    uploadItem,
})

export const showUploadProgress = () => ({
    type: 'UPLOAD_SHOW_PROGRESS',
})

export const hideUploadProgress = () => ({
    type: 'UPLOAD_HIDE_PROGRESS',
})

export const chooseMenuItem = (itemName: string) => ({
    type: 'CHOOSE_MENUITEM',
    itemName,
})

export const chooseSubmenuItem = (itemName: string) => ({
    type: 'CHOOSE_SUBMENUITEM',
    itemName,
})

export const openViewer = (id: number) => ({
    type: 'OPEN_VIEWER',
    id,
})

export const closeViewer = () => ({
    type: 'CLOSE_VIEWER',
})

export const loadTypesToAddNewList = (idOrPath: number | string) => ({
    type: 'LOAD_TYPES_TO_ADDNEW_LIST',
    async payload(repository: Repository) {
        const data: { d: { Actions: IActionModel[] } } = await repository.getActions({ idOrPath, scenario: 'New' }) as any
        return data
    },
})

export const openDialog = (content: any = '', title?: string, onClose?: () => void, submitCallback?) => ({
    type: 'OPEN_DIALOG',
    title: title || '',
    content,
    onClose: onClose || null,
    submitCallback,
})

export const closeDialog = () => ({
    type: 'CLOSE_DIALOG',
})
export const setActionMenuId = (id: number | null) => ({
    type: 'SET_ACTIONMENU_ID',
    id,
})

export const loadVersions = (id: number) => ({
    type: 'LOAD_VERSIONS',
    payload: (repository: Repository) => repository.versioning.getVersions<GenericContent>(
        id, {
            select: ['Version', 'VersionModificationDate', 'CheckInComments', 'RejectReason', 'VersionModifiedBy/FullName' as any],
            expand: 'VersionModifiedBy' as any,
            metadata: 'no',
        },
    ),
})

export const handleDrawerMenu = (open: boolean) => ({
    type: 'HANDLE_DRAWERMENU',
    open,
})

export const loadBreadcrumbActions = (idOrPath: number | string) => ({
    type: 'LOAD_BREADCRUMB_ACTIONS',
    inject: async (options) => {
        if (idOrPath === options.getState().dms.actionmenu.breadcrumb.idOrPath) {
            return
        }
        const repository = options.getInjectable(Repository)
        const actions: { d: { Actions: IActionModel[] } } = await repository.getActions({ idOrPath, scenario: 'DMSBreadcrumb' }) as any
        options.dispatch({
            type: 'LOAD_BREADCRUMB_ACTIONS_SUCCESS',
            result: { idOrPath, actions: actions.d.Actions },
        })
    },
} as InjectableAction<rootStateType, AnyAction>)
