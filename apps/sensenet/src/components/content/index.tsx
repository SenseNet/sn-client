import { ConstantContent } from '@sensenet/client-core'
import { tuple } from '@sensenet/client-utils'
import React, { FunctionComponent, useContext, useEffect } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { GridKeyEnum } from '../../../src/components/grid/enums/GridKey.enum'
import { ResponsivePersonalSettings } from '../../context'
import { useLocalization } from '../../hooks'
import { useTreeNavigation } from '../../hooks/use-tree-navigation'
import { contentColumnDefs } from '../grid/Cols/ColumnDefs.'
import { PageTitle } from '../PageTitle'
import { useTreeLoading } from '../tree/Contexts/TreeLoadingProvider'
import { Explore, ExploreProps } from './Explore'

export const BrowseType = tuple('explorer')

type ContentProps = Partial<ExploreProps>

export const Content: FunctionComponent<ContentProps> = (props) => {
  const routeMatch = useRouteMatch<{ browseType: string; action?: string }>()
  const settings = useContext(ResponsivePersonalSettings)
  const path = props.rootPath || settings.content.root || ConstantContent.PORTAL_ROOT.Path
  const { currentPath, onNavigate } = useTreeNavigation(path)
  const localization = useLocalization().pageTitles

  const { setEnabledPath } = useTreeLoading()
  useEffect(() => {
    setEnabledPath(props.rootPath ?? '')
  }, [props.rootPath, setEnabledPath])

  switch (routeMatch.params.browseType) {
    default:
      return (
        <>
          {props.showPageTitle ? <PageTitle title={localization[currentPath as keyof typeof localization]} /> : null}
          <Explore
            currentPath={currentPath}
            onNavigate={onNavigate}
            rootPath={path}
            {...props}
            colDef={props.colDef ?? contentColumnDefs}
            gridKey={props.gridKey ?? GridKeyEnum.OTHER}
          />
        </>
      )
  }
}

export default Content
