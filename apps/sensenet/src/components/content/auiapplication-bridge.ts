export type AUIApplicationBridgeLocation = {
  href: string
  pathname: string
  search: string
  hash: string
  params: Record<string, string>
}

export type AUIApplicationBridgeTheme = 'light' | 'dark'

export type AUIApplicationBridgeFetchResponse = {
  ok: boolean
  status: number
  statusText: string
  url: string
  headers: Record<string, string>
  body: ArrayBuffer
}

export const createBridgeFetchResponse = async (response: Response): Promise<AUIApplicationBridgeFetchResponse> => {
  const headers: Record<string, string> = {}

  response.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value
  })

  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    url: response.url,
    headers,
    body: await response.arrayBuffer(),
  }
}

export const createBridgeLocation = (
  adminUiUrl: string,
  location: Pick<Location, 'pathname' | 'search' | 'hash'>,
): AUIApplicationBridgeLocation => {
  const pathname = location.pathname || '/'
  const search = location.search || ''
  const hash = location.hash || ''
  const params = (Object as any).fromEntries(new URLSearchParams(search)) as Record<string, string>

  return {
    href: `${adminUiUrl}${pathname}${search}${hash}`,
    pathname,
    search,
    hash,
    params,
  }
}

export const createBridgeTheme = (theme: string | undefined): AUIApplicationBridgeTheme =>
  theme === 'dark' ? 'dark' : 'light'
