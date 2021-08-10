import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { useCallback } from 'react'
import { LocalizationObject } from '../context'
import { usePersonalSettings } from '.'

export const parseDate = (date: number | Date) => {
  if (!date) return date
  return typeof date === 'string' ? parseISO(date) : date
}

/**
 * Custom hook that downloads a specified content from a repository
 * Has to be wrapped with **RepositoryContext**
 */
export const useDateUtils = () => {
  const personalSettings = usePersonalSettings()

  const formatDistanceFromNow = useCallback(
    (date: number | Date) => {
      return formatDistanceToNow(date, {
        locale: LocalizationObject[personalSettings.language].locale,
        addSuffix: true,
      })
    },
    [personalSettings.language],
  )

  const formatDate = useCallback(
    (date: number | Date, formatString: string) => {
      return format(parseDate(date), formatString, { locale: LocalizationObject[personalSettings.language].locale })
    },
    [personalSettings.language],
  )

  return {
    parseDate,
    formatDate,
    formatDistanceFromNow,
  }
}
