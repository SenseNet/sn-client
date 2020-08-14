import { NotificationService } from '@sensenet/client-utils'
import { useInjector } from '@sensenet/hooks-react'
import { useState } from 'react'

export const useNotificationService = () => {
  const injector = useInjector()
  const [notificationService] = useState(injector.getInstance(NotificationService))
  return notificationService
}
