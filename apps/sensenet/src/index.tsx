import CssBaseline from '@material-ui/core/CssBaseline'
import { Injector } from '@furystack/inject'
import { VerboseConsoleLogger } from '@furystack/logging'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { InjectorContext, LoggerContextProvider, SessionContextProvider } from '@sensenet/hooks-react'
import { HashRouter, Route } from 'react-router-dom'
import { DesktopLayout } from './components/layout/DesktopLayout'
import { MainRouter } from './components/MainRouter'
import { NotificationComponent } from './components/NotificationComponent'
import {
  ContentRoutingContextProvider,
  LocalizationProvider,
  PersonalSettingsContextProvider,
  RepositoryContextProvider,
  ResponsiveContextProvider,
  ThemeProvider,
} from './context'
import { CommandProviderManager } from './services/CommandProviderManager'
import { CheatCommandProvider } from './services/CommandProviders/CheatCommandProvider'
import { CustomActionCommandProvider } from './services/CommandProviders/CustomActionCommandProvider'
import { HelpCommandProvider } from './services/CommandProviders/HelpCommandProvider'
import { HistoryCommandProvider } from './services/CommandProviders/HistoryCommandProvider'
import { InFolderSearchCommandProvider } from './services/CommandProviders/InFolderSearchCommandProvider'
import { NavigationCommandProvider } from './services/CommandProviders/NavigationCommandProvider'
import { QueryCommandProvider } from './services/CommandProviders/QueryCommandProvider'
import { diMiddleware, store } from './store'
import './style.css'
import theme from './theme'
import './utils/errorToJson'
import './utils/InjectorExtensions'
import { EventLogger } from './services/EventLogger'

console.log(
  `%c@sensenet app v${process.env.APP_VERSION}
Branch ${process.env.GIT_BRANCH}
Commit '${process.env.GIT_COMMITHASH}' `,
  'color: #16AAA6; border-bottom: 1px solid black',
)

export const snInjector = new Injector()
snInjector.options.owner = 'SnApp'
snInjector.useLogging(VerboseConsoleLogger, EventLogger)

diMiddleware
  .getInjectable(CommandProviderManager)
  .RegisterProviders(
    CheatCommandProvider,
    CustomActionCommandProvider,
    HelpCommandProvider,
    HistoryCommandProvider,
    InFolderSearchCommandProvider,
    NavigationCommandProvider,
    QueryCommandProvider,
  )

ReactDOM.render(
  <CssBaseline>
    <Provider store={store}>
      <InjectorContext.Provider value={snInjector}>
        <LoggerContextProvider>
          <PersonalSettingsContextProvider>
            <LocalizationProvider>
              <HashRouter>
                <Route path="/:repo?">
                  <RepositoryContextProvider>
                    <ContentRoutingContextProvider>
                      <SessionContextProvider>
                        <ResponsiveContextProvider>
                          <ThemeProvider theme={theme}>
                            <DesktopLayout>
                              <MainRouter />
                              <NotificationComponent />
                            </DesktopLayout>{' '}
                          </ThemeProvider>
                        </ResponsiveContextProvider>
                      </SessionContextProvider>
                    </ContentRoutingContextProvider>
                  </RepositoryContextProvider>
                </Route>
              </HashRouter>
            </LocalizationProvider>
          </PersonalSettingsContextProvider>
        </LoggerContextProvider>
      </InjectorContext.Provider>
    </Provider>
  </CssBaseline>,
  document.getElementById('root'),
)
