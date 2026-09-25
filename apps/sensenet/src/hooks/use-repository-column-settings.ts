import { useLogger, useRepository } from '@sensenet/hooks-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ColumnSettingsSource,
  getLocalColumnSettingsPath,
  LegacyColumnSetting,
  LegacyColumnSettings,
  loadColumnSettings,
  normalizeColumnSettings,
  resolveColumnSettingsSource,
  saveColumnSettings,
} from '../services'

export const useRepositoryColumnSettings = (
  parentIdOrPath: string | number,
  explicitColumns?: LegacyColumnSetting[],
  reloadToken = 0,
) => {
  const repository = useRepository()
  const logger = useLogger('column-settings')
  const explicitSettings = useMemo(
    () => normalizeColumnSettings(explicitColumns ? { columns: explicitColumns } : undefined),
    [explicitColumns],
  )
  const [settings, setSettings] = useState<LegacyColumnSettings | undefined>(explicitSettings)
  const [isLoading, setIsLoading] = useState(!explicitSettings)
  const [settingsSource, setSettingsSource] = useState<ColumnSettingsSource | undefined>(() =>
    explicitSettings
      ? {
          kind: 'explicit',
          currentPath: typeof parentIdOrPath === 'string' ? parentIdOrPath : undefined,
          localSettingsPath:
            typeof parentIdOrPath === 'string' ? getLocalColumnSettingsPath(parentIdOrPath) : undefined,
        }
      : undefined,
  )

  useEffect(() => {
    if (explicitSettings) {
      setSettings(explicitSettings)
      setSettingsSource({
        kind: 'explicit',
        currentPath: typeof parentIdOrPath === 'string' ? parentIdOrPath : undefined,
        localSettingsPath: typeof parentIdOrPath === 'string' ? getLocalColumnSettingsPath(parentIdOrPath) : undefined,
      })
      setIsLoading(false)
      return
    }

    const abortController = new AbortController()
    let isCurrentRequest = true
    setSettings(undefined)
    setSettingsSource(undefined)
    setIsLoading(true)

    loadColumnSettings(repository, parentIdOrPath, abortController.signal)
      .then((loadedSettings) => {
        if (isCurrentRequest) {
          setSettings(loadedSettings)
        }
      })
      .catch((error) => {
        if (isCurrentRequest && !abortController.signal.aborted) {
          logger.warning({
            message: `Could not load ColumnSettings for ${parentIdOrPath}; using default columns.`,
            data: { error, relatedRepository: repository.configuration.repositoryUrl },
          })
          setSettings(undefined)
        }
      })
      .finally(() => {
        if (isCurrentRequest) {
          setIsLoading(false)
        }
      })

    // Source metadata is only needed by the editor; it must not hold up the folder contents.
    resolveColumnSettingsSource(repository, parentIdOrPath, abortController.signal)
      .then((source) => {
        if (isCurrentRequest) setSettingsSource(source)
      })
      .catch((error) => {
        if (isCurrentRequest && !abortController.signal.aborted) {
          logger.debug({
            message: `Could not resolve the ColumnSettings source for ${parentIdOrPath}`,
            data: { error, relatedRepository: repository.configuration.repositoryUrl },
          })
        }
      })

    return () => {
      isCurrentRequest = false
      abortController.abort()
    }
  }, [explicitSettings, logger, parentIdOrPath, reloadToken, repository])

  const save = useCallback(
    async (newSettings: LegacyColumnSettings, targetIdOrPath?: string | number) => {
      const saveTarget = targetIdOrPath ?? parentIdOrPath
      await saveColumnSettings(repository, saveTarget, newSettings)
      setSettings(newSettings)
      setSettingsSource((currentSource) =>
        !targetIdOrPath && currentSource?.localSettingsPath
          ? {
              ...currentSource,
              kind: 'local',
              effectiveSettingsPath: currentSource.localSettingsPath,
              effectiveSettingsOwnerPath: currentSource.currentPath,
            }
          : currentSource,
      )
    },
    [parentIdOrPath, repository],
  )

  return {
    columnSettings: settings?.columns,
    columnSettingsSource: settingsSource,
    isColumnSettingsLoading: isLoading,
    saveColumnSettings: save,
  }
}
