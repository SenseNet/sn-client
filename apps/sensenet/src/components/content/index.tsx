import { Button, Container, Grid, Typography } from '@material-ui/core'
import { ConstantContent } from '@sensenet/client-core'
import { tuple } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { ResponsivePersonalSettings } from '../../context'
import { useQuery } from '../../hooks/use-query'
import { getPrimaryActionUrl } from '../../services'
import { CommanderComponent } from './Commander'
import { Explore } from './Explore'
import { SimpleList } from './Simple'

export const BrowseType = tuple('commander', 'explorer', 'simple')

export const Content = () => {
  const repo = useRepository()
  const match = useRouteMatch<{ browseType: string }>()
  const pathFromQuery = useQuery().get('path')
  const secondaryPathFromQuery = useQuery().get('sPath')
  const history = useHistory()
  const settings = useContext(ResponsivePersonalSettings)
  const rootPath = settings.content.root ?? ConstantContent.PORTAL_ROOT.Path
  const [currentPath, setCurrentPath] = useState(pathFromQuery ? decodeURIComponent(pathFromQuery) : rootPath)
  const [secondaryPath, setSecondaryPath] = useState(
    secondaryPathFromQuery ? decodeURIComponent(secondaryPathFromQuery) : currentPath,
  )
  const [isPathValid, setIsPathValid] = useState<boolean>()

  const onNavigate = (content: GenericContent, isSecondary = false) => {
    const searchParams = new URLSearchParams(history.location.search)
    searchParams.set('path', content.Path)
    isSecondary && searchParams.set('sPath', secondaryPath)
    history.push(`${match.url}?${searchParams.toString()}`)
    setCurrentPath(content.Path)
  }

  const onNavigateSecondary = (content: GenericContent) => {
    const searchParams = new URLSearchParams(history.location.search)
    searchParams.set('path', currentPath)
    searchParams.set('sPath', content.Path)
    history.push(`${match.url}?${searchParams}`)
    setSecondaryPath(content.Path)
  }

  const onActivateItem = (activeItem: GenericContent) => history.push(getPrimaryActionUrl(activeItem, repo))

  useEffect(() => {
    // TODO: this should be refactored when data fetching is united
    async function checkPath() {
      if (currentPath === rootPath) {
        setIsPathValid(true)
        return
      }
      try {
        await repo.load({ idOrPath: currentPath })
        setIsPathValid(true)
      } catch {
        setIsPathValid(false)
      }
    }
    checkPath()
  }, [currentPath, repo, rootPath])

  if (isPathValid === undefined) {
    return null
  }

  if (!isPathValid) {
    return (
      <Container maxWidth="sm">
        <Grid container direction="column" justify="center">
          <Typography align="center" variant="h5" component="p">
            Cannot find path {currentPath}
          </Typography>
          <Button onClick={() => onNavigate({ Path: rootPath } as any)}>Go to root</Button>
        </Grid>
      </Container>
    )
  }

  switch (match.params.browseType) {
    case 'commander':
      return (
        <CommanderComponent
          rootPath={rootPath}
          leftParent={currentPath}
          rightParent={secondaryPath}
          onActivateItem={onActivateItem}
          onNavigateLeft={(content) => onNavigate(content, true)}
          onNavigateRight={onNavigateSecondary}
          fieldsToDisplay={settings.content.fields}
        />
      )
    case 'explorer':
      return (
        <Explore
          currentPath={currentPath}
          onNavigate={onNavigate}
          rootPath={rootPath}
          fieldsToDisplay={settings.content.fields}
        />
      )
    default:
      return (
        <SimpleList
          rootPath={rootPath}
          contentListProps={{
            onActivateItem,
            onParentChange: onNavigate,
            fieldsToDisplay: settings.content.fields,
            parentIdOrPath: currentPath,
          }}
          parent={currentPath}
        />
      )
  }
}

export default Content
