import { ConstantContent } from '@sensenet/client-core'
import { tuple } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { ResponsivePersonalSettings } from '../../context'
import { useQuery } from '../../hooks/use-query'
import { getPrimaryActionUrl, pathWithQueryParams } from '../../services'
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

  const onNavigate = (content: GenericContent, isSecondary = false) => {
    const nextPath = pathWithQueryParams({
      path: match.url,
      newParams: { path: content.Path, sPath: isSecondary ? secondaryPath : undefined },
      currentParams: new URLSearchParams(history.location.search),
    })
    history.push(nextPath)
    setCurrentPath(content.Path)
  }

  const onNavigateSecondary = (content: GenericContent) => {
    const nextPath = pathWithQueryParams({
      path: match.url,
      newParams: { path: currentPath, sPath: content.Path },
      currentParams: new URLSearchParams(history.location.search),
    })
    history.push(nextPath)
    setSecondaryPath(content.Path)
  }

  const onActivateItem = (activeItem: GenericContent) => history.push(getPrimaryActionUrl(activeItem, repo))

  useEffect(() => {
    if (!pathFromQuery) return

    const path = decodeURIComponent(pathFromQuery)
    setCurrentPath((currentState) => (currentState !== path ? path : currentState))
  }, [pathFromQuery])

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
