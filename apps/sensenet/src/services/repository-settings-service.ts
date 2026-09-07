import { Repository } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'

/** Read optional, inherited settings through the authenticated OData endpoint. */
export const loadRepositorySettings = async (
  repository: Repository,
  idOrPath: string | number,
  name: string,
  signal?: AbortSignal,
): Promise<Record<string, unknown> | undefined> => {
  const url = PathHelper.joinPaths(
    repository.configuration.repositoryUrl,
    repository.configuration.oDataToken,
    PathHelper.getContentUrl(idOrPath),
    'GetSettings',
  )
  const response = await repository.fetch(`${url}?${new URLSearchParams({ name })}`, {
    method: 'GET',
    credentials: 'include',
    signal,
  })

  // Older repositories can return an empty response or 404 when settings are absent.
  if (response.status === 404 || response.status === 204) return undefined
  if (!response.ok) throw await repository.getErrorFromResponse(response)

  const text = (await response.text()).trim()
  if (!text) return undefined
  const value = JSON.parse(text)
  // GetSettings returns "{}" as a JSON string on some server versions.
  const settings = typeof value === 'string' ? JSON.parse(value) : value
  if (settings === null) return undefined
  if (typeof settings !== 'object' || Array.isArray(settings)) {
    throw new Error(`Invalid ${name} settings response`)
  }
  return settings
}
