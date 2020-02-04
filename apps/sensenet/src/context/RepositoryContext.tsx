import { Repository } from '@sensenet/client-core'
import { useInjector, useLogger } from '@sensenet/hooks-react'
import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useRouteMatch } from 'react-router'
import { usePersonalSettings } from '../hooks'
import authService from '../services/auth-service'

type RepositoryContextType =
  | { repository: Repository | undefined; setRepository: Dispatch<SetStateAction<Repository | undefined>> }
  | undefined
const RepositoryContext = createContext<RepositoryContextType>(undefined)

export const lastRepositoryKey = 'sensenet-last-repository'

export const RepositoryContextProvider = (props: PropsWithChildren<{}>) => {
  const [repository, setRepository] = useState<Repository>()

  return <RepositoryContext.Provider value={{ repository, setRepository }}>{props.children}</RepositoryContext.Provider>
}

export function useRepository() {
  const injector = useInjector()
  const [isRepositoryFound, setIsRepositoryFound] = useState<boolean>()
  const match = useRouteMatch<{ repo?: string }>()
  const settings = usePersonalSettings()
  const logger = useLogger('useRepository')
  const context = useContext(RepositoryContext)

  if (!context) {
    throw new Error('useRepository must be used within a RepositoryContextProvider')
  }

  const { repository, setRepository } = context

  const getRepoWithToken = useCallback(
    (url: string) => {
      const getToken = async () => {
        const token = await authService.getAccessToken(url)
        if (!token) {
          setIsRepositoryFound(false)
          return
        }
        const repoWithToken = injector.getRepository(url, undefined, (input, init) => {
          const request = new Request(input, init)
          request.headers.append('Authorization', `Bearer ${token}`)
          return fetch(request)
        })
        setIsRepositoryFound(true)
        setRepository(repoWithToken)
      }
      getToken()
    },
    [injector, setRepository],
  )

  useEffect(() => {
    const subscription = authService.user.subscribe(user => {
      if (!user || !settings.lastRepository) {
        setIsRepositoryFound(false)
        return
      }
      getRepoWithToken(settings.lastRepository)
    })
    return () => subscription.dispose()
  }, [getRepoWithToken, settings.lastRepository])

  useEffect(() => {
    const repoFromUrl = (match.params.repo && atob(match.params.repo)) || ''

    const repoUrl = new RegExp('^https?://').test(repoFromUrl) ? repoFromUrl : settings.lastRepository

    const newRepoUrl = repoUrl ?? repository?.configuration.repositoryUrl
    if (newRepoUrl) {
      logger.debug({
        message: `Swithed from repository ${repository?.configuration.repositoryUrl} to ${newRepoUrl}`,
      })
      getRepoWithToken(newRepoUrl)
    } else {
      setIsRepositoryFound(false)
    }
  }, [getRepoWithToken, logger, match.params.repo, repository, settings.lastRepository])

  return { repository, setRepository, isRepositoryFound }
}
