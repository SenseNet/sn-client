import React from 'react'
import { Route, RouteProps } from 'react-router-dom'

interface AuthorizedRouteProps extends RouteProps {
  authorize: () => boolean
  unauthorizedComponent?: JSX.Element
}

export const AuthorizedRoute: React.StatelessComponent<AuthorizedRouteProps> = props =>
  props.authorize() ? <Route {...props} /> : props.unauthorizedComponent || null
