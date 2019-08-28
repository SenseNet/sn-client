import { useEffect, useState } from 'react'
import { GenericContent } from '@sensenet/default-content-types'
import { ConstantContent, ODataParams } from '@sensenet/client-core'
import { isReferenceField } from '../components/content-list'
import { useRepository } from '.'

interface Options {
  columns: Array<keyof GenericContent>
  top?: number
  query: string
  countOnly?: boolean
}

export const useQuery = (options: Options) => {
  const [items, setItems] = useState<GenericContent[]>([])
  const [loadChildrenSettings, setLoadChildrenSettings] = useState<ODataParams<GenericContent>>({})
  const [error, setError] = useState('')
  const [refreshToken, setRefreshToken] = useState(Math.random())
  const [count, setCount] = useState(0)

  const repo = useRepository()

  useEffect(() => {
    setLoadChildrenSettings({
      query: options.query,
      top: options.countOnly ? 1 : options.top,
      inlinecount: 'allpages',
      select: ['Actions', ...options.columns],
      expand: ['Actions', ...options.columns.filter(f => isReferenceField(f, repo))],
    })
  }, [options.columns, options.countOnly, options.query, options.top, repo])

  useEffect(() => {
    const ac = new AbortController()
    if (loadChildrenSettings.query) {
      ;(async () => {
        try {
          setError('')
          const result = await repo.loadCollection({
            path: ConstantContent.PORTAL_ROOT.Path,
            oDataOptions: loadChildrenSettings,
            requestInit: {
              signal: ac.signal,
            },
          })
          setCount(result.d.__count)
          setItems(result.d.results)
        } catch (e) {
          if (!ac.signal.aborted) {
            setError(e.toString())
          }
        }
      })()
      return () => ac.abort()
    }
  }, [loadChildrenSettings, repo, refreshToken])

  return {
    items,
    error,
    count,
    loadChildrenSettings,
    setLoadChildrenSettings,
    refresh: () => setRefreshToken(Math.random()),
  }
}
