export type AUIApplicationBridgeLocation = {
  href: string
  pathname: string
  search: string
  hash: string
  params: Record<string, string>
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
