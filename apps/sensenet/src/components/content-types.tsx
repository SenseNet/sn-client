import React from 'react'
import { useRouteMatch } from 'react-router'
import { useTreeNavigation } from '../hooks/use-tree-navigation'
import { Explore } from './content/Explore'

const contentTypesPath = '/Root/System/Schema/ContentTypes'
const fieldsToDisplay = ['DisplayName', 'Description', 'ParentTypeName' as any, 'ModificationDate', 'ModifiedBy']

export default function ContentTypes() {
  const match = useRouteMatch<{ browseType: string }>()
  const { currentPath, onNavigate } = useTreeNavigation(contentTypesPath)

  switch (match.params.browseType) {
    default:
      return (
        <Explore
          currentPath={currentPath}
          rootPath={contentTypesPath}
          fieldsToDisplay={fieldsToDisplay}
          onNavigate={onNavigate}
          loadChildrenSettings={{
            select: fieldsToDisplay,
            query: "+TypeIs:'ContentType' .AUTOFILTERS:OFF",
          }}
        />
      )
  }
}
