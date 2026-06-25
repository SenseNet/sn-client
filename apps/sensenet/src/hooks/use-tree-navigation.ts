import { GenericContent } from '@sensenet/default-content-types'
import { useCallback, useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { resolvePathParams } from '../application-paths'
import { useQuery } from '../hooks/use-query'
import { useSelectionService } from '../hooks/use-selection-service'
import { pathWithQueryParams } from '../services/query-string-builder'

export const useTreeNavigation = (defaultPath: string) => {
  const history = useHistory()
  const match = useRouteMatch<{ browseType: string }>()
  const selectionService = useSelectionService()
  const pathFromQuery = useQuery().get('path')
  const [currentPath, setCurrentPath] = useState(pathFromQuery ? decodeURIComponent(pathFromQuery) : '')

  const onNavigate = useCallback(
    (content: GenericContent) => {
      selectionService.activeContent.setValue(content)
      const searchParams = new URLSearchParams(history.location.search)
      searchParams.delete('content')
      const newPath = content.Path.replace(defaultPath, '')
      const newPathParams = { ...match.params, action: undefined }
      history.push(
        pathWithQueryParams({
          path: resolvePathParams({ path: match.path as any, params: newPathParams as any }),
          newParams: { path: newPath },
          currentParams: searchParams,
        }),
      )
      setCurrentPath(newPath)
    },
    [history, match.path, match.params, defaultPath, selectionService.activeContent],
  )

  useEffect(() => {
    const path = pathFromQuery ? decodeURIComponent(pathFromQuery) : ''
    setCurrentPath(path)
  }, [pathFromQuery])

  return {
    currentPath: `${defaultPath}${currentPath || ''}`,
    onNavigate,
  }
}
