import React, { useEffect } from 'react'
import { authConfigKey } from '../../context'
import { useQuery } from '../../hooks/use-query'
import { AuthOverrideSkeleton } from './auth-override-skeleton'

export const NotAuthenticatedOverride = () => {
  const message = useQuery().get('message')

  useEffect(() => {
    if (message === 'access_denied') {
      window.localStorage.removeItem(authConfigKey)
      window.location.replace('/')
    }
  }, [message])

  return <AuthOverrideSkeleton primaryText="Authentication" secondaryText="You are not authenticated." />
}
