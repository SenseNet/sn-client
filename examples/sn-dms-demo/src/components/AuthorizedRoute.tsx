import React from 'react'
import { Route, RouteComponentProps, RouteProps, withRouter } from 'react-router-dom'

import { Location } from 'history'

export interface AuthorizedRouteProps extends RouteComponentProps<any>, RouteProps {
  authorize: () => boolean
  redirectOnUnauthorized: string
  location: Location
}

export class AuthorizedRouteComponent extends React.Component<AuthorizedRouteProps> {
  constructor(props: AuthorizedRouteComponent['props']) {
    super(props)
    this.checkIsAuthorized(props)
  }

  private checkIsAuthorized(props = this.props) {
    if (!props.authorize()) {
      props.history.push(props.redirectOnUnauthorized)
    }
  }

  public UNSAFE_componentWillReceiveProps(newProps: this['props']) {
    this.checkIsAuthorized(newProps)
  }

  public render() {
    const { ...routeProps } = { ...this.props }
    return <Route {...routeProps} />
  }
}

const component = withRouter(AuthorizedRouteComponent)

export { component as AuthorizedRoute }
