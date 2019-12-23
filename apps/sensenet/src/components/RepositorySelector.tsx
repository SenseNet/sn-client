import Typography from '@material-ui/core/Typography'
import React, { useContext, useEffect, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { useRepository } from '@sensenet/hooks-react'
import logo from '../assets/sensenet-icon-32.png'
import { ResponsiveContext } from '../context'
import { usePersonalSettings, useTheme } from '../hooks'

export const RepositorySelectorComponent: React.FunctionComponent<RouteComponentProps & {
  alwaysOpened?: boolean
}> = () => {
  const settings = usePersonalSettings()
  const repo = useRepository()
  const theme = useTheme()
  const device = useContext(ResponsiveContext)
  const [lastRepositoryName, setLastRepositoryName] = useState('')
  const [lastRepositoryUrl, setLastRepositoryUrl] = useState('')

  useEffect(() => {
    const lastRepo = settings.repositories.find(r => r.url === repo.configuration.repositoryUrl)
    if (lastRepo) {
      setLastRepositoryName(lastRepo.displayName || lastRepo.url)
      setLastRepositoryUrl(lastRepo.url)
    }
  }, [repo, settings])

  return (
    <Typography
      style={{
        textAlign: device === 'mobile' ? 'center' : 'left',
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
      variant="h5">
      <Link to="/">
        <img src={logo} style={{ marginRight: '.5em', filter: 'drop-shadow(0px 0px 3px black)' }} alt="logo" />
      </Link>
      <Link
        to={`/${btoa(lastRepositoryUrl)}`}
        title={lastRepositoryName}
        style={{
          flexShrink: 1,
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textDecoration: 'none',
          color: theme.palette.text.primary,
        }}>
        {lastRepositoryName}
      </Link>
    </Typography>
  )
}

const routed = withRouter(RepositorySelectorComponent)

export { routed as RepositorySelector }
