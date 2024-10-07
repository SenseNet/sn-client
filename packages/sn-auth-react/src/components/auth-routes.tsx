import React, { memo, ReactNode, useEffect } from 'react'
import { Authenticating } from './authenticating'

export type AuthRoutesProps = {
  callbackUri: string
  currentPath: string
  children: ReactNode
}

const AuthRoutesComponent = ({ callbackUri, children, currentPath }: AuthRoutesProps) => {
  useEffect(() => {
    console.log(currentPath)
  }, [currentPath])

  switch (currentPath) {
    case callbackUri:
      return <Authenticating />
    default:
      return <>{children}</>
  }
}

export const AuthRoutes = memo(AuthRoutesComponent)
