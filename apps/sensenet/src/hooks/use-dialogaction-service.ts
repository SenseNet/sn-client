import { useInjector } from '@sensenet/hooks-react'
import { useState } from 'react'
import { DialogActionService } from '../services/dialogActionService'

export const useDialogActionService = () => {
  const injector = useInjector()
  const [dialogActionService] = useState(injector.getInstance(DialogActionService))
  return dialogActionService
}
