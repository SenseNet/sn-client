import format from 'date-fns/format'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import enUS from 'date-fns/locale/en-US'
import hu from 'date-fns/locale/hu'
import parseISO from 'date-fns/parseISO'
import { usePersonalSettings } from '.'

export const parseDate = (date: any) => {
  if (!date) return date
  return typeof date === 'string' ? parseISO(date) : date
}

export const formatDate = (date: any, formatString: string, locale = navigator.language) => {
  return format(parseDate(date), formatString, { locale: locale === 'hu' ? hu : enUS })
}

/**
 * Custom hook that downloads a specified content from a repository
 * Has to be wrapped with **RepositoryContext**
 */
export const useDateUtils = () => {
  const personalSettings = usePersonalSettings()

  const formatDistanceFromNow = (date: any) => {
    const isHungarian = personalSettings.language === 'hungarian'
    return formatDistanceToNow(date, { locale: isHungarian ? hu : enUS, addSuffix: true })
  }

  return {
    /**
     * Parse date
     */
    parseDate,

    /**
     * Format date
     */
    formatDate,

    /**
     * Format distance from now
     */
    formatDistanceFromNow,
  }
}
