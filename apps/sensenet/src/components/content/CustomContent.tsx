import { ConstantContent } from '@sensenet/client-core'
import React, { FunctionComponent, useContext, useEffect } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { GridKeyEnum } from '../../../src/components/grid/enums/GridKey.enum'
import { ResponsivePersonalSettings } from '../../context'
import { useTreeNavigation } from '../../hooks/use-tree-navigation'
import { contentExplorerColumnDefs } from '../grid/Cols/ColumnDefs.'
import { useTreeLoading } from '../tree/Contexts/TreeLoadingProvider'
import { Explore, ExploreProps } from './Explore'

type ContentProps = Partial<ExploreProps>

export const CustomContent: FunctionComponent<ContentProps> = ({ rootPath }) => {
  const match = useRouteMatch<{ browseType: string; path: string }>()
  const settings = useContext(ResponsivePersonalSettings)

  const customDrawer = settings.drawer.items.find((item) => item.settings?.appPath === match.params.path)
  const path = customDrawer?.settings.root || settings.content.root || ConstantContent.PORTAL_ROOT.Path
  const { currentPath, onNavigate } = useTreeNavigation(path)

  const { setEnabledPath } = useTreeLoading()
  useEffect(() => {
    setEnabledPath(rootPath ?? '')
  }, [rootPath, setEnabledPath])

  switch (match.params.browseType) {
    default:
      return (
        <Explore
          currentPath={currentPath}
          colDef={contentExplorerColumnDefs}
          gridKey={GridKeyEnum.CONTENT}
          onNavigate={onNavigate}
          rootPath={path}
          fieldsToDisplay={customDrawer?.settings.columns}
        />
      )
  }
}

export default CustomContent
