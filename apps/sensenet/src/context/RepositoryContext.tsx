import { Repository } from '@sensenet/client-core'
import React, { useContext, useEffect, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { useInjector, useLogger } from '../hooks'
import { PersonalSettingsContext } from './PersonalSettingsContext'

export const lastRepositoryKey = 'sensenet-last-repository'

export const RepositoryContext = React.createContext(new Repository())

export const RepositoryContextProviderComponent: React.FunctionComponent<
  RouteComponentProps<{ repo?: string }>
> = props => {
  const injector = useInjector()
  const settings = useContext(PersonalSettingsContext)
  const [repo, setRepo] = useState(new Repository())
  const logger = useLogger('RepositoryContext')

  useEffect(() => {
    let repoFromUrl = ''
    try {
      repoFromUrl = (props.match.params.repo && atob(props.match.params.repo)) || ''
    } catch (error) {
      /** */
    }

    const repoUrl =
      (repoFromUrl && repoFromUrl.startsWith('http://')) || repoFromUrl.startsWith('https://')
        ? repoFromUrl
        : settings.lastRepository

    const newRepo =
      repoUrl && repoUrl.length && repoUrl !== repo.configuration.repositoryUrl && injector.getRepository(repoUrl)
    if (newRepo) {
      logger.debug({
        message: `Swithed from repository ${repo.configuration.repositoryUrl} to ${
          newRepo.configuration.repositoryUrl
        }`,
        data: {
          digestMessage: 'Repository switched {count} times',
          multiple: true,
        },
      })
      setRepo(newRepo)
    }
  }, [settings.lastRepository, props.match.params.repo])

  return <RepositoryContext.Provider value={repo}>{props.children}</RepositoryContext.Provider>
}

const routed = withRouter(RepositoryContextProviderComponent)
export { routed as RepositoryContextProvider }
