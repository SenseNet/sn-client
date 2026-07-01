import { FormControl, InputLabel, makeStyles, MenuItem, Select, Theme } from '@material-ui/core'
import { useRepository } from '@sensenet/hooks-react'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../../application-paths'
import { useRepositorySwitch } from '../../context'
import { useLocalization } from '../../hooks'
import {
  getAuthenticatedSnAuthRepositorySessions,
  normalizeRepositoryUrl,
  snAuthRepositorySessionsChangedEvent,
} from '../../services/repository-session'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(1, 1, 0),
  },
  formControl: {
    width: '100%',
  },
}))

const getRepositoryHost = (repoUrl: string) => {
  try {
    return new URL(repoUrl).host
  } catch {
    return repoUrl
  }
}

export const RepositorySelector = () => {
  const classes = useStyles()
  const history = useHistory()
  const localization = useLocalization().repositorySelector
  const repository = useRepository()
  const { authType, switchRepository } = useRepositorySwitch()
  const currentRepositoryUrl = normalizeRepositoryUrl(repository.configuration.repositoryUrl)
  const [repositorySessions, setRepositorySessions] = useState(getAuthenticatedSnAuthRepositorySessions)

  useEffect(() => {
    const refreshRepositorySessions = () => setRepositorySessions(getAuthenticatedSnAuthRepositorySessions())

    window.addEventListener(snAuthRepositorySessionsChangedEvent, refreshRepositorySessions)

    return () => window.removeEventListener(snAuthRepositorySessionsChangedEvent, refreshRepositorySessions)
  }, [])

  if (authType !== 'SNAuth' || repositorySessions.length < 2) {
    return null
  }

  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl} variant="outlined" size="small">
        <InputLabel id="repository-selector-label">{localization.activeRepository}</InputLabel>
        <Select
          labelId="repository-selector-label"
          label={localization.activeRepository}
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
            <MenuItem key={repositorySession.repoUrl} value={repositorySession.repoUrl}>
              {getRepositoryHost(repositorySession.repoUrl)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}
