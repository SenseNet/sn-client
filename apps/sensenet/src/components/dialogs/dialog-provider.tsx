import React, { createContext } from 'react'
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
  | { name: 'copy-move'; props: CopyMoveDialogProps }) & { dialogProps?: DialogProps }

type Dispatch = (action: Action) => void

type Action = { type: 'PUSH_DIALOG'; dialog: DialogWithProps } | { type: 'POP_DIALOG' } | { type: 'CLOSE_ALL_DIALOGS' }

type State = {
  dialogs: DialogWithProps[]
}

const DialogContext = createContext<[State, Dispatch] | undefined>(undefined)

const initialState: State = { dialogs: [] }

function dialogReducer(state: State, action: Action) {
  switch (action.type) {
    case 'PUSH_DIALOG': {
      // Get last dialog from a copy of dialogs
      const currentModal = [...state.dialogs].slice(-1)[0]
      if (currentModal && currentModal.name === action.dialog.name) {
        return state
      }
      return { dialogs: [...state.dialogs, action.dialog] }
    }
    case 'POP_DIALOG': {
      const dialogsCopy = [...state.dialogs]
      dialogsCopy.pop()
      return { dialogs: dialogsCopy }
    }
    case 'CLOSE_ALL_DIALOGS':
      return initialState
    default: {
      return state
    }
  }
}

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(dialogReducer, initialState)

  return <DialogContext.Provider value={[state, dispatch]}>{children}</DialogContext.Provider>
}

/**
 * Custom hook that returns functions for dialog management
 */
export function useDialog() {
  const context = React.useContext(DialogContext)

  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider')
  }
  const [{ dialogs }, dispatch] = context

  const closeAllDialogs = () => dispatch({ type: 'CLOSE_ALL_DIALOGS' })
  const closeLastDialog = () => dispatch({ type: 'POP_DIALOG' })
  const openDialog = (dialog: DialogWithProps) => dispatch({ type: 'PUSH_DIALOG', dialog })

  return {
    dialogs,
    closeAllDialogs,
    closeLastDialog,
    openDialog,
  }
}
