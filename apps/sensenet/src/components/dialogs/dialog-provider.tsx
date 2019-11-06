import React, { createContext } from 'react'
import { ErrorBoundaryState } from '../error-boundary'
import { DeleteContentDialogProps, ErrorReportProps } from '.'

export type DialogWithProps =
  | { name: 'delete'; props: DeleteContentDialogProps }
  | { name: 'error-report'; props: ErrorReportProps }
  | { name: 'error'; props: ErrorBoundaryState }

export type DialogDispatch = (action: Action) => void

type Action = { type: 'PUSH_DIALOG'; dialog: DialogWithProps } | { type: 'POP_DIALOG' } | { type: 'CLOSE_ALL_DIALOGS' }

type State = {
  dialogs: DialogWithProps[]
}

const DialogContext = createContext<State | undefined>(undefined)
const DialogDispatchContext = createContext<DialogDispatch | undefined>(undefined)

const initialState: State = { dialogs: [] }

function dialogReducer(state: State, action: Action) {
  switch (action.type) {
    case 'PUSH_DIALOG': {
      // Get last elemnt from a copy of dialogs
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

  return (
    <DialogContext.Provider value={state}>
      <DialogDispatchContext.Provider value={dispatch}>{children}</DialogDispatchContext.Provider>
    </DialogContext.Provider>
  )
}

/**
 * Custom hook for dialog state.
 */
export function useDialogState() {
  const context = React.useContext(DialogContext)

  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider')
  }

  return context
}

/**
 * Custom hook that can be used to dispatch a dialog action. Use this if you don't need the dialog state.
 */
export function useDialogDispatch() {
  const context = React.useContext(DialogDispatchContext)

  if (!context) {
    throw new Error('useDialogDispatch must be used within a DialogProvider')
  }

  return context
}

/**
 * Custom hook that returns useDialogDispatch and useDialogState as an array.
 */
export function useDialog(): [State, DialogDispatch] {
  return [useDialogState(), useDialogDispatch()]
}
