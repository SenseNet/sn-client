import React, { memo, ReactNode } from 'react'
import { Authenticating } from './authenticating'

export type AuthRoutesProps = {
  callbackUri: string
  currentPath: string
  children: ReactNode
}

const AuthRoutesComponent = ({ callbackUri, children, currentPath }: AuthRoutesProps) => {
  switch (currentPath) {
    case callbackUri:
      return <Authenticating />
    default:
      return <>{children}</>
  }
}

export const AuthRoutes = memo(AuthRoutesComponent)
