import React from 'react'
import { useHistory } from 'react-router-dom'
import { CallbackComponent } from 'redux-oidc'
import { userManager } from '../userManager'

export const Callback = () => {
  const history = useHistory()

  return (
    <CallbackComponent
      userManager={userManager}
      successCallback={() => {
        console.log('Success')
        history.push('/')
      }}
      errorCallback={error => {
        history.push('/')
        console.error(error)
      }}>
      <div>Redirecting...</div>
    </CallbackComponent>
  )
}
