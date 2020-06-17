import { GenericContent } from '@sensenet/default-content-types'
import { useCallback, useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { useQuery } from '../hooks/use-query'
import { pathWithQueryParams } from '../services/query-string-builder'

export const useTreeNavigation = (defaultPath: string) => {
  const history = useHistory()
  const match = useRouteMatch<{ browseType: string }>()
  const pathFromQuery = useQuery().get('path')
  const [currentPath, setCurrentPath] = useState(pathFromQuery ? decodeURIComponent(pathFromQuery) : '')

  const onNavigate = useCallback(
    (content: GenericContent) => {
      const searchParams = new URLSearchParams(history.location.search)
      const newPath = content.Path.replace(defaultPath, '')
      history.push(
        pathWithQueryParams({
          path: match.url,
          newParams: { path: newPath },
          currentParams: searchParams,
        }),
      )
      setCurrentPath(newPath)
    },
    [history, match.url, defaultPath],
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
