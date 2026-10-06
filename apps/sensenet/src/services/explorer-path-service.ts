import { Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'

const pathFields = ['Id', 'Path', 'Name', 'DisplayName', 'Type', 'Icon', 'IsFolder', 'IsFile'] as const

/** Accept repository paths and relative paths without interpreting percent signs as URL escapes. */
export const normalizeExplorerPath = (value: string, currentFolder = '/Root'): string | undefined => {
  const text = value.trim()
  if (Array.from(text).some((character) => character.charCodeAt(0) < 32) || /^[a-z][a-z\d+.-]*:/i.test(text))
    return undefined
  const absolute = text.startsWith('/') || /^root(?:\/|$)/i.test(text)
  const segments = (absolute ? text : `${currentFolder}/${text}`).split('/').filter(Boolean)
  if (segments[0]?.toLowerCase() === 'root') segments.shift()
  const normalized = ['Root']
  for (const segment of segments) {
    if (segment === '.') continue
    if (segment === '..') {
      if (normalized.length > 1) normalized.pop()
    } else normalized.push(segment)
  }
  return `/${normalized.join('/')}`
}

const escapeQueryValue = (value: string) => value.replace(/[\\"*?]/g, '\\$&')

export const getExplorerPathCompletion = (value: string, currentFolder: string) => {
  const path = normalizeExplorerPath(value, currentFolder)
  if (!path) return undefined
  const lastSlash = path.lastIndexOf('/')
  const listChildren = !value.trim() || value.trim().endsWith('/') || path === '/Root'
  const folder = listChildren ? path : path.slice(0, lastSlash)
  const prefix = listChildren ? '' : path.slice(lastSlash + 1)
  return {
    folder,
    prefix,
    query: `+InFolder:"${escapeQueryValue(folder)}"${prefix ? ` +Name:"${escapeQueryValue(prefix)}*"` : ''}`,
  }
}

/** Autocomplete only examines immediate children, with a small server-side result limit. */
export const loadExplorerPathSuggestions = async (
  repository: Repository,
  value: string,
  currentFolder: string,
  signal: AbortSignal,
  includeHidden = true,
) => {
  const completion = getExplorerPathCompletion(value, currentFolder)
  if (!completion) return []
  const response = await repository.loadCollection<GenericContent>({
    path: '/Root',
    requestInit: { signal },
    oDataOptions: {
      query: completion.query,
      select: [...pathFields],
      onlyselectList: true,
      top: 20,
      inlinecount: 'none',
      metadata: 'no',
      orderby: [
        ['IsFolder', 'desc'],
        ['Name', 'asc'],
      ],
      enableautofilters: !includeHidden,
      enablelifespanfilter: false,
    },
  })
  return response.d.results
}

/** Resolve an exact path before routing; querying avoids URL syntax in names such as # or %. */
export const findExplorerPath = async (repository: Repository, path: string, signal: AbortSignal) => {
  const response = await repository.loadCollection<GenericContent>({
    path: '/Root',
    requestInit: { signal },
    oDataOptions: {
      query: `+Path:"${escapeQueryValue(path)}"`,
      select: [...pathFields],
      onlyselectList: true,
      top: 1,
      inlinecount: 'none',
      metadata: 'no',
      enableautofilters: false,
      enablelifespanfilter: false,
    },
  })
  return response.d.results.find((item) => item.Path.toLowerCase() === path.toLowerCase())
}
