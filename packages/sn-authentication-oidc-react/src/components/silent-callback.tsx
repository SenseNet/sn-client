import { UserManager } from 'oidc-client'
import React, { useEffect } from 'react'

export const SilentCallback = () => {
  useEffect(() => {
    new UserManager({}).signinSilentCallback()
    console.info('callback silent signin successfull')
  })

  return <div />
}
