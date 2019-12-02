import CssBaseline from '@material-ui/core/CssBaseline'

import React from 'react'
import ReactDOM from 'react-dom'
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
import './style.css'
import theme from './theme'
import './utils/errorToJson'
import './utils/InjectorExtensions'
import { snInjector } from './sn-injector'
import { DialogProvider } from './components/dialogs/dialog-provider'
import { Dialogs } from './components/dialogs'

console.log(
  `%c@sensenet app v${process.env.APP_VERSION}
Branch ${process.env.GIT_BRANCH}
Commit '${process.env.GIT_COMMITHASH}' `,
  'color: #16AAA6; border-bottom: 1px solid black',
)

snInjector
  .getInstance(CommandProviderManager)
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
                          <DialogProvider>
                            <DesktopLayout>
                              <MainRouter />
                              <NotificationComponent />
                              <Dialogs />
                            </DesktopLayout>
                          </DialogProvider>
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
  </CssBaseline>,
  document.getElementById('root'),
)
