import { ConstantContent } from '@sensenet/client-core'
import { tuple } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useContext } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { ResponsivePersonalSettings } from '../../context'
import { useTreeNavigation } from '../../hooks/use-tree-navigation'
import { Explore } from './Explore'

export const BrowseType = tuple('commander', 'explorer', 'simple')

interface ContentProps {
  rootPath?: string
  fieldsToDisplay?: Array<keyof GenericContent>
}

export const Content: React.FunctionComponent<ContentProps> = (props) => {
  const match = useRouteMatch<{ browseType: string }>()
  const settings = useContext(ResponsivePersonalSettings)
  const rootPath = props.rootPath || settings.content.root || ConstantContent.PORTAL_ROOT.Path
  const { currentPath, onNavigate } = useTreeNavigation(rootPath)

  switch (match.params.browseType) {
    default:
      return (
        <Explore
          currentPath={currentPath}
          onNavigate={onNavigate}
          rootPath={rootPath}
          fieldsToDisplay={props.fieldsToDisplay}
        />
      )
  }
}

export default Content
