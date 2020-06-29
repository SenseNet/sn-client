import React, { useEffect } from 'react'
import { getUserManager } from '../authentication-service'

export const SilentCallback = () => {
  useEffect(() => {
    getUserManager()!.signinSilentCallback()
  }, [])

  return <div />
}
