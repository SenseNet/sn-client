import React, { createContext, useCallback, useContext, useReducer } from 'react'
import { DialogProps } from '@material-ui/core/Dialog'
import { ErrorBoundaryState } from '../error-boundary'
import {
  ContentInfoDialogProps,
  CopyMoveDialogProps,
  DeleteContentDialogProps,
  EditPropertiesProps,
  ErrorReportProps,
} from '.'

export type DialogWithProps = (
  | { name: 'delete'; props: DeleteContentDialogProps }
  | { name: 'error-report'; props: ErrorReportProps }
  | { name: 'error'; props: ErrorBoundaryState }
  | { name: 'edit'; props: EditPropertiesProps }
  | { name: 'info'; props: ContentInfoDialogProps }
  | { name: 'copy-move'; props: CopyMoveDialogProps }
) & { dialogProps?: DialogProps }

type Action = { type: 'PUSH_DIALOG'; dialog: DialogWithProps } | { type: 'POP_DIALOG' } | { type: 'CLOSE_ALL_DIALOGS' }

const initialState: DialogWithProps[] = []
const DialogContext = createContext<{ dialogs: typeof initialState; dispatch: React.Dispatch<Action> } | undefined>(
  undefined,
)

function dialogReducer(state: typeof initialState, action: Action) {
  switch (action.type) {
    case 'PUSH_DIALOG': {
      // Get last dialog from a copy of dialogs
      const currentModal = [...state].slice(-1)[0]
      if (currentModal && currentModal.name === action.dialog.name) {
        return state
      }
      return [...state, action.dialog]
    }
    case 'POP_DIALOG': {
      const dialogsCopy = [...state]
      dialogsCopy.pop()
      return dialogsCopy
    }
    case 'CLOSE_ALL_DIALOGS':
      return initialState
    default: {
      return state
    }
  }
}

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [dialogs, dispatch] = useReducer(dialogReducer, initialState)

  return <DialogContext.Provider value={{ dialogs, dispatch }}>{children}</DialogContext.Provider>
}

/**
 * Custom hook that returns functions for dialog management
 */
export function useDialog() {
  const context = useContext(DialogContext)

  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider')
  }
  const { dispatch, dialogs } = context

  const closeAllDialogs = useCallback(() => dispatch({ type: 'CLOSE_ALL_DIALOGS' }), [dispatch])
  const closeLastDialog = useCallback(() => dispatch({ type: 'POP_DIALOG' }), [dispatch])
  const openDialog = useCallback((dialog: DialogWithProps) => dispatch({ type: 'PUSH_DIALOG', dialog }), [dispatch])

  return {
    dialogs,
    closeAllDialogs,
    closeLastDialog,
    openDialog,
  }
}
