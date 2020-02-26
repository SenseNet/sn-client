import Typography from '@material-ui/core/Typography'
import React, { useContext, useEffect, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { useRepository } from '@sensenet/hooks-react'
import { createStyles, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import logo from '../assets/sensenet-icon-32.png'
import { ResponsiveContext } from '../context'
import { usePersonalSettings } from '../hooks'
import { globals, useGlobalStyles } from '../globalStyles'

const useStyles = makeStyles(() => {
  return createStyles({
    typography: {
      textAlign: 'left',
      flexGrow: 1,
      overflow: 'hidden',
    },
    textAlignCenter: {
      textAlign: 'center',
    },
    logo: {
      marginRight: '39px',
      filter: 'drop-shadow(0px 0px 3px black)',
    },
    repoUrl: {
      width: '288px',
      flexShrink: 1,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      marginRight: '4px',
      fontSize: '20px',
      textOverflow: 'ellipsis',
      textDecoration: 'none',
      color: globals.common.headerText,
      opacity: '87%',
    },
  })
})

export const RepositorySelectorComponent: React.FunctionComponent<RouteComponentProps & {
  alwaysOpened?: boolean
}> = () => {
  const settings = usePersonalSettings()
  const repo = useRepository()
  const device = useContext(ResponsiveContext)
  const [lastRepositoryName, setLastRepositoryName] = useState('')
  const [lastRepositoryUrl, setLastRepositoryUrl] = useState('')
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  useEffect(() => {
    const lastRepo = settings.repositories.find(r => r.url === repo.configuration.repositoryUrl)
    if (lastRepo) {
      setLastRepositoryName(lastRepo.displayName || lastRepo.url)
      setLastRepositoryUrl(lastRepo.url)
    }
  }, [repo, settings])

  return (
    <Typography
      className={clsx(globalClasses.centeredVertical, classes.typography, {
        [classes.textAlignCenter]: device === 'mobile',
      })}>
      <Link to="/" className={globalClasses.centeredVertical}>
        <img src={logo} className={classes.logo} alt="logo" />
      </Link>
      <Link to={`/${btoa(lastRepositoryUrl)}`} title={lastRepositoryName} className={classes.repoUrl}>
        {lastRepositoryName}
      </Link>
    </Typography>
  )
}

const routed = withRouter(RepositorySelectorComponent)

export { routed as RepositorySelector }
