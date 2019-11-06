import { useEffect } from 'react'
import { useDialogDispatch } from './dialogs'
import { ErrorBoundaryProps } from './error-boundary'

/**
 * This component will not render anything, only make a call to dialog provider to open an error dialog.
 */
export const ErrorBoundaryWithDialogs: ErrorBoundaryProps['FallbackComponent'] = props => {
  const dispatchDialogAction = useDialogDispatch()

  useEffect(() => {
    dispatchDialogAction({
      type: 'PUSH_DIALOG',
      dialog: { name: 'error', props: { error: props.error!, info: props.info } },
    })
  }, [dispatchDialogAction, props.error, props.info])

  return null
}
