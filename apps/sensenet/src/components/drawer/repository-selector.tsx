import { useRepository } from '@sensenet/hooks-react'
import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../../application-paths'
import { useRepositorySwitch } from '../../context'
import { useLocalization } from '../../hooks'
import { getLocalRepositories, localSessionsChanged } from '../../services/local-authentication'
import {
  getAuthenticatedSnAuthRepositorySessions,
  normalizeRepositoryUrl,
  snAuthRepositorySessionsChangedEvent,
} from '../../services/repository-session'

const getRepositoryHost = (repoUrl: string) => {
  try {
    return new URL(repoUrl).host
  } catch {
    return repoUrl
  }
}

export const RepositorySelector = () => {
  const history = useHistory()
  const localization = useLocalization().repositorySelector
  const repository = useRepository()
  const { authType, switchRepository } = useRepositorySwitch()
  const currentRepositoryUrl = normalizeRepositoryUrl(repository.configuration.repositoryUrl)
  const readSessions = useCallback(
    () =>
      authType === 'Local'
        ? getLocalRepositories().map((repoUrl) => ({ repoUrl }))
        : getAuthenticatedSnAuthRepositorySessions(),
    [authType],
  )
  const [repositorySessions, setRepositorySessions] = useState(readSessions)

  useEffect(() => {
    const refreshRepositorySessions = () => setRepositorySessions(readSessions())
    refreshRepositorySessions()
    window.addEventListener(localSessionsChanged, refreshRepositorySessions)

    window.addEventListener(snAuthRepositorySessionsChangedEvent, refreshRepositorySessions)

    return () => {
      window.removeEventListener(localSessionsChanged, refreshRepositorySessions)
      window.removeEventListener(snAuthRepositorySessionsChangedEvent, refreshRepositorySessions)
    }
  }, [readSessions])

  if ((authType !== 'SNAuth' && authType !== 'Local') || repositorySessions.length < 2) {
    return null
  }

  return (
    <label className="sn-app-navigation__repository">
      <span>{localization.activeRepository}</span>
      <select
        aria-label={localization.activeRepository}
        data-test="repository-selector"
        value={currentRepositoryUrl}
        onChange={(ev) => {
          const nextRepositoryUrl = ev.target.value as string

          if (nextRepositoryUrl === currentRepositoryUrl) {
            return
          }

          switchRepository(nextRepositoryUrl)
          history.push(PATHS.landingPath.appPath)
        }}>
        {repositorySessions.map((repositorySession) => (
          <option key={repositorySession.repoUrl} value={repositorySession.repoUrl}>
            {getRepositoryHost(repositorySession.repoUrl)}
          </option>
        ))}
      </select>
    </label>
  )
}
