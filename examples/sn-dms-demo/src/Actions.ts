import {
  Repository,
  UploadFromEventOptions,
  UploadFromFileListOptions,
  UploadProgressInfo,
} from '@sensenet/client-core'
import { ObservableValue, usingAsync } from '@sensenet/client-utils'
import { ActionModel, ContentType, GenericContent, File as SnFile } from '@sensenet/default-content-types'
import { Dispatch } from 'redux'
import { IInjectableActionCallbackParams } from 'redux-di-middleware'
import { debounceReloadOnProgress } from './store/documentlibrary/actions'
import { rootStateType } from './store/rootReducer'

export enum MessageMode {
  error = 'error',
  warning = 'warning',
  info = 'info',
}

export const userRegistration = (username: string, email: string, password: string) => ({
  type: 'USER_REGISTRATION_REQUEST',
  username,
  email,
  password,
  async payload(repository: Repository) {
    return await repository.executeAction({
      name: 'RegisterUser',
      idOrPath: `/Root/IMS('Public')`,
      body: {
        username,
        email,
        password,
      },
      method: 'POST',
    })
  },
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
export const openActionMenu = (
  actions: ActionModel[],
  content: GenericContent,
  title: string,
  element: HTMLElement | EventTarget | null,
  position?: { left: number; top: number },
  customItems?: ActionModel[],
) => ({
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

export const loadListActions = (idOrPath: number | string, scenario?: string) => ({
  type: 'LOAD_LIST_ACTIONS',
  idOrPath,
  scenario,
})

export const setListActions = (actions: ActionModel[]) => ({
  type: 'SET_LIST_ACTIONS',
  actions,
})

export const getListActions = (idOrPath: number | string, scenario?: string, customActions?: ActionModel[]) => ({
  type: 'GET_LIST_ACTIONS',
  async inject(options: IInjectableActionCallbackParams<rootStateType>) {
    const actionsState = options.getState().dms.toolbar
    if (!actionsState.isLoading && (actionsState.idOrPath !== idOrPath || actionsState.scenario !== scenario)) {
      options.dispatch(loadListActions(idOrPath, scenario))
      const repository = options.getInjectable(Repository)
      const data: { d: { Actions: ActionModel[] } } = (await repository.getActions({ idOrPath, scenario })) as any
      const actions = customActions ? [...data.d.Actions, ...customActions] : data.d.Actions
      const ordered = actions.sort((a, b) => {
        const x = a.Index
        const y = b.Index
        return x < y ? -1 : x > y ? 1 : 0
      })
      options.dispatch(setListActions(ordered))
    }
  },
})

export const loadUserActions = (idOrPath: number | string, scenario?: string, customActions?: ActionModel[]) => ({
  type: 'LOAD_USER_ACTIONS',
  async payload(repository: Repository) {
    const data: { d: { Actions: ActionModel[] } } = (await repository.getActions({ idOrPath, scenario })) as any
    const actions = customActions ? [...data.d.Actions, ...customActions] : data.d.Actions
    return {
      d: {
        Actions: actions.sort((a: ActionModel, b: ActionModel) => {
          const x = a.Index
          const y = b.Index
          return x < y ? -1 : x > y ? 1 : 0
        }),
      },
    }
  },
})

export type ExtendedUploadProgressInfo = UploadProgressInfo & { content?: GenericContent; visible?: boolean }

export const changedContent: GenericContent[] = []

export const updateUploadItem = (uploadItem: ExtendedUploadProgressInfo) => ({
  type: 'UPLOAD_UPDATE_ITEM',
  uploadItem,
})

export const addUploadItem = (uploadItem: ExtendedUploadProgressInfo) => ({
  type: 'UPLOAD_ADD_ITEM',
  uploadItem,
})

export const trackUploadProgress = async <T extends GenericContent>(
  currentValue: ExtendedUploadProgressInfo,
  getState: () => rootStateType,
  dispatch: Dispatch,
  api: Repository,
) => {
  let currentUpload = getState().dms.uploads.uploads.find((u) => u.guid === currentValue.guid)
  if (currentUpload) {
    dispatch(updateUploadItem(currentValue))
  } else {
    dispatch(
      addUploadItem({
        ...currentValue,
        visible: true,
      }),
    )
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

export const uploadFileList = <T extends SnFile>(
  uploadOptions: Pick<UploadFromFileListOptions<T>, Exclude<keyof UploadFromFileListOptions<T>, 'repository'>>,
) => ({
  type: 'DMS_UPLOAD_FILE_LIST_INJECTABLE_ACTION',
  inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
    const api = options.getInjectable(Repository)
    await usingAsync(new ObservableValue<UploadProgressInfo>(), async (progress) => {
      progress.subscribe(async (currentValue) =>
        trackUploadProgress(currentValue, options.getState, options.dispatch, api),
      )
      try {
        await api.upload.fromFileList({
          ...uploadOptions,
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

export const uploadDataTransfer = <T extends SnFile>(
  uploadOptions: Pick<UploadFromEventOptions<T>, Exclude<keyof UploadFromEventOptions<T>, 'repository'>>,
) => ({
  type: 'DMS_UPLOAD_DATA_TRANSFER_INJECTABLE_ACTION',
  inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
    const api = options.getInjectable(Repository)
    await usingAsync(new ObservableValue<UploadProgressInfo>(), async (progress) => {
      progress.subscribe(async (currentValue) =>
        trackUploadProgress(currentValue, options.getState, options.dispatch, api),
      )
      try {
        await api.upload.fromDropEvent({
          ...uploadOptions,
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
    const data: { d: { results: ContentType[] } } = (await repository.executeAction({
      idOrPath,
      method: 'GET',
      name: 'EffectiveAllowedChildTypes',
    })) as any
    return data
  },
})

export const openDialog = (
  content: JSX.Element | React.Component | Element,
  title?: string,
  onClose?: () => void,
  submitCallback?: () => void,
) => ({
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
  payload: (repository: Repository) =>
    repository.versioning.getVersions<GenericContent>(id, {
      select: [
        'Version',
        'VersionModificationDate',
        'CheckInComments',
        'RejectReason',
        'VersionModifiedBy/FullName' as any,
      ],
      expand: ['VersionModifiedBy'],
      metadata: 'no',
    }),
})

export const handleDrawerMenu = (open: boolean) => ({
  type: 'HANDLE_DRAWERMENU',
  open,
})

export const loadBreadcrumbActions = (idOrPath: number | string) => ({
  type: 'LOAD_BREADCRUMB_ACTIONS',
  inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
    if (idOrPath === options.getState().dms.actionmenu.breadcrumb.idOrPath) {
      return
    }
    const repository = options.getInjectable(Repository)
    const actions: { d: { Actions: ActionModel[] } } = (await repository.getActions({
      idOrPath,
      scenario: 'ContextMenu',
    })) as any
    options.dispatch({
      type: 'LOAD_BREADCRUMB_ACTIONS_SUCCESS',
      result: {
        idOrPath,
        actions: actions.d.Actions.filter((action) => action.Name !== 'Browse' && action.Name !== 'SetPermissions'),
      },
    })
  },
})
