import format from 'date-fns/format'
import en from 'date-fns/locale/en-US'
import hu from 'date-fns/locale/hu'
import parseISO from 'date-fns/parseISO'

export const parseDate = (date: any) => {
  if (!date) return date
  return typeof date === 'string' ? parseISO(date) : date
}
export const formatDate = (date: any, formatString: string, locale = navigator.language) => {
  return format(parseDate(date), formatString, { locale: locale === 'hu' ? hu : en })
}
