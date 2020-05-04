import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { authConfigKey } from '../../context'
import { useQuery } from '../../hooks/use-query'
import { AuthOverrideSkeleton } from './auth-override-skeleton'

export const NotAuthenticatedOverride = () => {
  const message = useQuery().get('message')
  const history = useHistory()

  useEffect(() => {
    if (message === 'access_denied') {
      window.localStorage.removeItem(authConfigKey)
      history.push('/')
    }
  }, [history, message])

  return <AuthOverrideSkeleton primaryText="Authentication" secondaryText="You are not authenticated." />
}
