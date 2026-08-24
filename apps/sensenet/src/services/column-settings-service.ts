import { Repository } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'

export type LegacyColumnSetting = {
  field: string
  title?: string
}

export type LegacyColumnSettings = {
  columns: LegacyColumnSetting[]
}

export type ColumnSettingsSource = {
  kind: 'local' | 'inherited' | 'none' | 'explicit'
  currentPath?: string
  effectiveSettingsPath?: string
  effectiveSettingsOwnerPath?: string
  localSettingsPath?: string
}

const SETTINGS_FOLDER_NAME = 'Settings'
const COLUMN_SETTINGS_FILE_NAME = 'ColumnSettings.settings'

const isColumnSetting = (value: unknown): value is LegacyColumnSetting =>
  Boolean(value && typeof value === 'object' && typeof (value as LegacyColumnSetting).field === 'string')

export const normalizeColumnSettings = (value: unknown): LegacyColumnSettings | undefined => {
  if (!value || typeof value !== 'object' || !Array.isArray((value as LegacyColumnSettings).columns)) {
    return undefined
  }

  const columns = (value as LegacyColumnSettings).columns.filter(isColumnSetting)
  return columns.length ? { columns } : undefined
}

const getSettingsOperationUrl = (repository: Repository, parentIdOrPath: string | number, operation: string) =>
  PathHelper.joinPaths(
    repository.configuration.repositoryUrl,
    repository.configuration.oDataToken,
    PathHelper.getContentUrl(parentIdOrPath),
    operation,
  )

const normalizeRepositoryPath = (path: string) => `/${PathHelper.trimSlashes(path)}`

export const getLocalColumnSettingsPath = (contentPath: string) =>
  normalizeRepositoryPath(PathHelper.joinPaths(contentPath, SETTINGS_FOLDER_NAME, COLUMN_SETTINGS_FILE_NAME))

const getAncestorPaths = (contentPath: string) => {
  const paths: string[] = []
  let currentPath = PathHelper.trimSlashes(contentPath)

  while (currentPath) {
    paths.push(currentPath)
    const parentPath = PathHelper.getParentPath(currentPath)
    if (!parentPath || parentPath === currentPath) break
    currentPath = parentPath
  }

  return paths
}

const resolveContentPath = async (repository: Repository, parentIdOrPath: string | number, signal?: AbortSignal) => {
  if (typeof parentIdOrPath === 'string' && PathHelper.getSegments(parentIdOrPath).length) {
    return normalizeRepositoryPath(parentIdOrPath)
  }

  const response = await repository.load<GenericContent>({
    idOrPath: parentIdOrPath,
    oDataOptions: { select: ['Path'] },
    requestInit: { signal },
  })
  return normalizeRepositoryPath(response.d.Path)
}

/** Finds the closest repository file that supplies the effective ColumnSettings value. */
export const resolveColumnSettingsSource = async (
  repository: Repository,
  parentIdOrPath: string | number,
  signal?: AbortSignal,
): Promise<ColumnSettingsSource> => {
  const currentPath = await resolveContentPath(repository, parentIdOrPath, signal)
  const localSettingsPath = getLocalColumnSettingsPath(currentPath)
  const candidates = getAncestorPaths(currentPath).map((ownerPath) => ({
    ownerPath: normalizeRepositoryPath(ownerPath),
    settingsPath: getLocalColumnSettingsPath(ownerPath),
  }))
  const matches = await Promise.all(
    candidates.map(async (candidate) => {
      try {
        const response = await repository.load<GenericContent>({
          idOrPath: candidate.settingsPath,
          oDataOptions: { select: ['Path'] },
          requestInit: { signal },
        })
        return {
          ownerPath: candidate.ownerPath,
          settingsPath: normalizeRepositoryPath(response.d.Path || candidate.settingsPath),
        }
      } catch (error) {
        if (signal?.aborted) throw error
        return undefined
      }
    }),
  )
  const effectiveSettings = matches.find(Boolean)
  const effectiveSettingsPath = effectiveSettings?.settingsPath

  return {
    kind: !effectiveSettingsPath ? 'none' : effectiveSettingsPath === localSettingsPath ? 'local' : 'inherited',
    currentPath,
    effectiveSettingsPath,
    effectiveSettingsOwnerPath: effectiveSettings?.ownerPath,
    localSettingsPath,
  }
}

/** Loads the effective, potentially inherited ColumnSettings.settings for a content. */
export const loadColumnSettings = async (
  repository: Repository,
  parentIdOrPath: string | number,
  signal?: AbortSignal,
) => {
  const requestUrl = `${getSettingsOperationUrl(repository, parentIdOrPath, 'GetSettings')}?${new URLSearchParams({
    name: 'ColumnSettings',
  })}`
  const response = await repository.fetch(requestUrl, {
    method: 'GET',
    credentials: 'include',
    signal,
  })

  if (!response.ok) {
    throw await repository.getErrorFromResponse(response)
  }

  return normalizeColumnSettings(await response.json())
}

/** Persists the legacy { columns: [{ field, title }] } contract through WriteSettings. */
export const saveColumnSettings = async (
  repository: Repository,
  parentIdOrPath: string | number,
  settings: LegacyColumnSettings,
) => {
  const response = await repository.fetch(getSettingsOperationUrl(repository, parentIdOrPath, 'WriteSettings'), {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'ColumnSettings',
      settingsData: settings,
    }),
  })

  if (!response.ok) {
    throw await repository.getErrorFromResponse(response)
  }
}
