import React, { useEffect } from 'react'
import { UserManager } from 'oidc-client'

export const SilentCallback = () => {
  useEffect(() => {
    new UserManager({}).signinSilentCallback()
  })

  return <div />
}
