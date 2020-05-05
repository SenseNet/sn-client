import React from 'react'
import { AuthOverrideSkeleton } from './auth-override-skeleton'

export type SessionLostProps = {
  onAuthenticate: () => void
}

export const SessionLostOverride = ({ onAuthenticate }: SessionLostProps) => {
  return (
    <AuthOverrideSkeleton
      primaryText="Session timed out"
      secondaryText="Your session has expired. Please re-authenticate yourself."
      buttonText="re-authenticate"
      buttonOnClick={onAuthenticate}
    />
  )
}
