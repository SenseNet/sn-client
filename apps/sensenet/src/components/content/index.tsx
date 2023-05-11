import { ConstantContent } from '@sensenet/client-core'
import { tuple } from '@sensenet/client-utils'
import React, { FunctionComponent, useContext } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { ResponsivePersonalSettings } from '../../context'
import { useLocalization } from '../../hooks'
import { useTreeNavigation } from '../../hooks/use-tree-navigation'
import { PageTitle } from '../PageTitle'
import { Explore, ExploreProps } from './Explore'

export const BrowseType = tuple('explorer')

type ContentProps = Partial<ExploreProps>

export const Content: FunctionComponent<ContentProps> = ({ rootPath, showPageTitle, ...props }) => {
  const routeMatch = useRouteMatch<{ browseType: string; action?: string }>()
  const settings = useContext(ResponsivePersonalSettings)
  const path = rootPath || settings.content.root || ConstantContent.PORTAL_ROOT.Path
  const { currentPath, onNavigate } = useTreeNavigation(path)
  const localization = useLocalization().pageTitles

  switch (routeMatch.params.browseType) {
    default:
      return (
        <>
          {showPageTitle ? <PageTitle title={localization[currentPath as keyof typeof localization]} /> : null}
          <Explore currentPath={currentPath} onNavigate={onNavigate} rootPath={path} {...props} />
        </>
      )
  }
}

export default Content
