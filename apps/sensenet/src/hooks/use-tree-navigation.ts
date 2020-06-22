import { GenericContent } from '@sensenet/default-content-types'
import { useCallback, useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { useQuery } from '../hooks/use-query'
import { pathWithQueryParams } from '../services/query-string-builder'

export const useTreeNavigation = (defaultPath: string) => {
  const history = useHistory()
  const match = useRouteMatch<{ browseType: string }>()
  const pathFromQuery = useQuery().get('path')
  const [currentPath, setCurrentPath] = useState(pathFromQuery ? decodeURIComponent(pathFromQuery) : defaultPath)

  const onNavigate = useCallback(
    (content: GenericContent) => {
      const searchParams = new URLSearchParams(history.location.search)
      history.push(
        pathWithQueryParams({ path: match.url, newParams: { path: content.Path }, currentParams: searchParams }),
      )
      setCurrentPath(content.Path)
    },
    [history, match.url],
  )

  useEffect(() => {
    const path = pathFromQuery ? decodeURIComponent(pathFromQuery) : defaultPath
    setCurrentPath(path)
  }, [pathFromQuery, defaultPath])

  return {
    currentPath,
    onNavigate,
  }
}
