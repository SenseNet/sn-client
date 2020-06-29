import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { authConfigKey } from '../../context'
import { useQuery } from '../../hooks/use-query'
import { AuthOverrideSkeleton } from './auth-override-skeleton'

export const NotAuthenticatedOverride = (props: { clearState: Function }) => {
  const message = useQuery().get('message')
  const history = useHistory()

  useEffect(() => {
    if (message === 'access_denied') {
      window.localStorage.removeItem(authConfigKey)
      props.clearState()
      window.location.replace('/')
    }
  }, [history, message, props])

  return <AuthOverrideSkeleton primaryText="Authentication" secondaryText="You are not authenticated." />
}
