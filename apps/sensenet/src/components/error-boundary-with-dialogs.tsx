import { useEffect } from 'react'
import { useDialog } from './dialogs'
import { ErrorBoundaryProps } from './error-boundary'

/**
 * This component will not render anything, only make a call to dialog provider to open an error dialog.
 */
export const ErrorBoundaryWithDialogs: ErrorBoundaryProps['FallbackComponent'] = (props) => {
  const { openDialog } = useDialog()

  useEffect(() => {
    openDialog({
      name: 'error',
      props: { error: props.error!, info: props.info },
      dialogProps: { BackdropProps: { style: { backgroundColor: 'black' } }, open: true },
    })
  }, [openDialog, props.error, props.info])

  return null
}
