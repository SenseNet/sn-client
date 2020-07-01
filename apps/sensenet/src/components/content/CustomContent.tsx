import { ConstantContent } from '@sensenet/client-core'
import React, { useContext } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { ResponsivePersonalSettings } from '../../context'
import { useTreeNavigation } from '../../hooks/use-tree-navigation'
import { Explore, ExploreProps } from './Explore'

type ContentProps = Partial<ExploreProps>

export const CustomContent: React.FunctionComponent<ContentProps> = () => {
  const match = useRouteMatch<{ browseType: string; path: string }>()
  const settings = useContext(ResponsivePersonalSettings)

  const customDrawer = settings.drawer.items.find((item) => item.settings?.appPath === match.params.path)
  const path = customDrawer?.settings.root || settings.content.root || ConstantContent.PORTAL_ROOT.Path
  const { currentPath, onNavigate } = useTreeNavigation(path)

  switch (match.params.browseType) {
    default:
      return (
        <Explore
          currentPath={currentPath}
          onNavigate={onNavigate}
          rootPath={path}
          fieldsToDisplay={customDrawer?.settings.columns}
        />
      )
  }
}

export default CustomContent
