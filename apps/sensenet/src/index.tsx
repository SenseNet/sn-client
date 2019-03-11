import { Injector } from '@furystack/inject'
import CssBaseline from '@material-ui/core/CssBaseline'
import React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { DesktopLayout } from './components/layout/DesktopLayout'
import { MainRouter } from './components/MainRouter'
import { InjectorContext } from './context/InjectorContext'
import { PersonalSettingsContextProvider } from './context/PersonalSettingsContext'
import { RepositoryContextProvider } from './context/RepositoryContext'
import { ResponsiveContextProvider } from './context/ResponsiveContextProvider'
import { SessionContextProvider } from './context/SessionContext'
import { ThemeProvider } from './context/ThemeProvider'
import './gif'
import './jpg'
import './png'
import { store } from './store'
import './style.css'
import theme from './theme'
import './utils/InjectorExtensions'

ReactDOM.render(
  <CssBaseline>
    <Provider store={store}>
      <InjectorContext.Provider value={new Injector()}>
        <PersonalSettingsContextProvider>
          <RepositoryContextProvider>
            <SessionContextProvider>
              <HashRouter>
                <ResponsiveContextProvider>
                  <ThemeProvider theme={theme}>
                    <DesktopLayout>
                      <MainRouter />
                    </DesktopLayout>{' '}
                  </ThemeProvider>
                </ResponsiveContextProvider>
              </HashRouter>
            </SessionContextProvider>
          </RepositoryContextProvider>
        </PersonalSettingsContextProvider>
      </InjectorContext.Provider>
    </Provider>
  </CssBaseline>,
  document.getElementById('root'),
)
