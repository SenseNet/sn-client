import React, { useEffect } from 'react'
import { authConfigKey } from '../context'
import { useQuery } from '../hooks/use-query'

export default function NotAuthenticated() {
  const message = useQuery().get('message')

  useEffect(() => {
    if (message === 'access_denied') {
      window.localStorage.removeItem(authConfigKey)
      window.location.replace('/')
    }
  }, [message])

  return <p>{message}</p>
}
