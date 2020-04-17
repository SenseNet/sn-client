import { UserManager } from 'oidc-client'
import React, { useEffect } from 'react'

export const SilentCallback = () => {
  useEffect(() => {
    new UserManager({}).signinSilentCallback()
  })

  return <div />
}
