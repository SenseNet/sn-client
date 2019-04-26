import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import { OauthProvider } from '@sensenet/authentication-jwt'
import { LoginState } from '@sensenet/client-core'
import React from 'react'
import Loadable from 'react-loadable'
import { connect } from 'react-redux'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import 'typeface-roboto'
import * as DMSActions from './Actions'
import { dmsTheme } from './assets/dmstheme'
import { AuthorizedRoute } from './components/AuthorizedRoute'
import { FullScreenLoader } from './components/FullScreenLoader'
import MessageBar from './components/MessageBar'
import Login from './pages/Login'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Registration from './pages/Registration'
import './Sensenet.css'
import { rootStateType } from './store/rootReducer'

const mapStateToProps = (state: rootStateType) => {
  return {
    loginState: state.sensenet.session.loginState,
    currentUserId: state.sensenet.session.user.content.Id,
  }
}

const verifyCaptcha = DMSActions.verifyCaptchaSuccess
const clearReg = DMSActions.clearRegistration

const mapDispatchToProps = {
  recaptchaCallback: verifyCaptcha,
  clearRegistration: clearReg,
}

export interface SensenetProps {
  oAuthProvider: OauthProvider
}

class Sensenet extends React.Component<SensenetProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps> {
  public name: string = ''
  public password: string = ''

  constructor(props: Sensenet['props']) {
    super(props)
  }
  public render() {
    // if (this.props.loginState === LoginState.Pending
    //   || (this.props.loginState === LoginState.Authenticated && this.props.currentUserId === ConstantContent.VISITOR_USER.Id)) {
    //   return null
    // }
    return (
      <MuiThemeProvider theme={dmsTheme}>
        <div
          className="root"
          style={{
            minHeight:
              document.documentElement && window.innerHeight >= document.documentElement.offsetHeight
                ? window.innerHeight
                : 'auto',
          }}>
          <HashRouter>
            <Switch>
              <AuthorizedRoute
                exact={true}
                path="/login"
                authorize={() => this.props.loginState !== LoginState.Authenticated}
                redirectOnUnauthorized="/">
                <Login oauthProvider={this.props.oAuthProvider} clear={this.props.clearRegistration} />
              </AuthorizedRoute>
              <AuthorizedRoute
                exact={true}
                path="/registration"
                authorize={() => this.props.loginState !== LoginState.Authenticated}
                redirectOnUnauthorized="/">
                <Registration oAuthProvider={this.props.oAuthProvider} verify={this.props.recaptchaCallback} />
              </AuthorizedRoute>

              <AuthorizedRoute
                exact={true}
                path="/privacypolicy"
                authorize={() => this.props.loginState !== LoginState.Authenticated}
                redirectOnUnauthorized="/">
                <PrivacyPolicy />
              </AuthorizedRoute>

              {/* Empty path, default routes per login state */}
              {this.props.loginState === LoginState.Unauthenticated ? <Redirect path="*" to="/login" /> : null}
              {/* {this.props.loginState === LoginState.Authenticated ? <Redirect path="*" to="/" /> : null} */}

              <AuthorizedRoute
                path="/"
                authorize={() => this.props.loginState !== LoginState.Unauthenticated}
                redirectOnUnauthorized="/"
                render={routerProps => {
                  const LoadableDashboard = Loadable({
                    loader: () => import(/* webpackChunkName: "dashboard" */ './pages/Dashboard'),
                    loading: () => <FullScreenLoader />,
                  })
                  return <LoadableDashboard {...routerProps} currentId={0} />
                }}
              />

              {/* Not found */}
              <Route path="*" exact={true}>
                <Redirect to="/" />
              </Route>
            </Switch>
          </HashRouter>
        </div>
        <MessageBar />
      </MuiThemeProvider>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Sensenet)
