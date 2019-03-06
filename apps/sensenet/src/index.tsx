import { Injector } from '@furystack/inject'
import CssBaseline from '@material-ui/core/CssBaseline'
import React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { InjectorContext } from './components/InjectorContext'
import { DesktopLayout } from './components/layout/DesktopLayout'
import { MainRouter } from './components/MainRouter'
import { PersonalSettingsContextProvider } from './components/PersonalSettingsContext'
import { ResponsiveContextProvider } from './components/ResponsiveContextProvider'
import { ThemeProvider } from './components/ThemeProvider'
import './gif'
import './jpg'
import './png'
import { store } from './store'
import './style.css'
import theme from './theme'

ReactDOM.render(
  <CssBaseline>
    <Provider store={store}>
      <InjectorContext.Provider value={new Injector()}>
        <HashRouter>
          <PersonalSettingsContextProvider>
            <ResponsiveContextProvider>
              <ThemeProvider theme={theme}>
                <DesktopLayout>
                  <MainRouter />
                </DesktopLayout>{' '}
              </ThemeProvider>
            </ResponsiveContextProvider>
          </PersonalSettingsContextProvider>
        </HashRouter>
      </InjectorContext.Provider>
    </Provider>
  </CssBaseline>,
  document.getElementById('root'),
)
