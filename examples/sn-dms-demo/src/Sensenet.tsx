/* eslint-disable react/display-name */
import { MuiThemeProvider } from '@material-ui/core/styles'
import React from 'react'
import Loadable from 'react-loadable'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { dmsTheme } from './assets/dmstheme'
import { AuthorizedRoute } from './components/AuthorizedRoute'
import { Callback } from './components/Callback'
import { FullScreenLoader } from './components/FullScreenLoader'
import MessageBar from './components/MessageBar'
import DashboardComponent from './pages/Dashboard'
import { Login } from './pages/Login'
import './Sensenet.css'

export function Sensenet() {
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
        <BrowserRouter>
          <Switch>
            <Route path="/authentication/callback">
              <Callback />
            </Route>
            <AuthorizedRoute
              path="/wopi"
              render={(routerProps) => {
                console.log('in path /wopi')
                const LoadableEditor = Loadable({
                  loader: () => import(/* webpackChunkName: "editor" */ './pages/Editor'),
                  loading: () => <FullScreenLoader />,
                })
                return <LoadableEditor {...routerProps} currentId={0} />
              }}
            />
            <Route path="/login">
              <Login />
            </Route>

            <AuthorizedRoute path="/">
              <DashboardComponent currentId={0} />
            </AuthorizedRoute>
          </Switch>
        </BrowserRouter>
      </div>
      <MessageBar />
    </MuiThemeProvider>
  )
}
