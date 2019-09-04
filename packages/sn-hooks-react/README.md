# @sensenet/hooks-react

> Sensenet related logic as React hooks for reusability.

[![NPM version](https://img.shields.io/npm/v/@sensenet/hooks-react.svg?style=flat)](https://www.npmjs.com/package/@sensenet/hooks-react)
[![NPM downloads](https://img.shields.io/npm/dt/@sensenet/hooks-react.svg?style=flat)](https://www.npmjs.com/package/@sensenet/hooks-react)
[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)

## Install

```bash
# Yarn
yarn add @sensenet/hooks-react

# NPM
npm install @sensenet/hooks-react
```

## Usage

You can use the custom hooks in a similar way as the build-in React hooks, respecting the [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html).

### Custom contexts and Providers

- CurrentAncestors and CurrentAncestorsProvider
- CurrentChildren and CurrentChildrenProvider
- CurrentContent and CurrentContentProvider
- InjectorContext
- LoadSettingsContext and LoadSettingsContextProvider
- LoggerContext and LoggerContextProvider
- RepositoryContext
- SessionContext and SessionContextProvider

### Custom hooks

- useDownload
- useInjector
- useLogger
- useRepositoryEvents
- useRepository
- useSession
- useVersionInfo
- useWopi
