import { ConstantContent } from '@sensenet/client-core'
import { tuple } from '@sensenet/client-utils'
import React, { useContext } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { ResponsivePersonalSettings } from '../../context'
import { useTreeNavigation } from '../../hooks/use-tree-navigation'
import { Explore, ExploreProps } from './Explore'

export const BrowseType = tuple('explorer')

type ContentProps = Partial<ExploreProps>

export const Content: React.FunctionComponent<ContentProps> = ({ rootPath, ...props }) => {
  const routeMatch = useRouteMatch<{ browseType: string; action?: string }>()
  const settings = useContext(ResponsivePersonalSettings)
  const path = rootPath || settings.content.root || ConstantContent.PORTAL_ROOT.Path
  const { currentPath, onNavigate } = useTreeNavigation(path)

  switch (routeMatch.params.browseType) {
    default:
      return <Explore currentPath={currentPath} onNavigate={onNavigate} rootPath={path} {...props} />
  }
}

export default Content
