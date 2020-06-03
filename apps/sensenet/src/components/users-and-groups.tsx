import { GenericContent } from '@sensenet/default-content-types'
import React, { useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { useQuery } from '../hooks/use-query'
import { Explore } from './content/Explore'

export default function UsersAndGroups() {
  const history = useHistory()
  const match = useRouteMatch<{ browseType: string }>()
  const pathFromQuery = useQuery().get('path')
  const [currentPath, setCurrentPath] = useState(pathFromQuery ? decodeURIComponent(pathFromQuery) : '/Root/IMS/Public')

  const onNavigate = (content: GenericContent) => {
    const searchParams = new URLSearchParams(history.location.search)
    searchParams.set('path', content.Path)
    history.push(`${match.url}?${searchParams.toString()}`)
    setCurrentPath(content.Path)
  }

  return (
    <Explore
      currentPath={currentPath}
      rootPath="/Root/IMS/Public"
      fieldsToDisplay={['DisplayName', 'ModificationDate', 'ModifiedBy', 'Actions']}
      onNavigate={onNavigate}
    />
  )
}
