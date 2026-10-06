import { GenericContent } from '@sensenet/default-content-types'

export const preferredCsvColumns = [
  'Id',
  'Path',
  'Name',
  'DisplayName',
  'Type',
  'CreatedBy',
  'CreationDate',
  'ModifiedBy',
  'ModificationDate',
  'Version',
  'Index',
]

const excludedColumns = new Set(['Actions', 'Children', '__metadata'])

const getColumnNames = (contents: GenericContent[]) => {
  const columnNames = new Set<string>()

  contents.forEach((content) => {
    Object.keys(content).forEach((key) => {
      if (!excludedColumns.has(key)) {
        columnNames.add(key)
      }
    })
  })

  return [
    ...preferredCsvColumns.filter((columnName) => columnNames.has(columnName)),
    ...Array.from(columnNames)
      .filter((columnName) => !preferredCsvColumns.includes(columnName))
      .sort((left, right) => left.localeCompare(right)),
  ]
}

const serializeValue = (value: unknown): string => {
  if (value === undefined || value === null) {
    return ''
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (['string', 'number', 'boolean'].includes(typeof value)) {
    return String(value)
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeValue(item)).join('; ')
  }

  if (typeof value === 'object') {
    const contentLikeValue = value as Partial<GenericContent>
    return contentLikeValue.DisplayName || contentLikeValue.Name || contentLikeValue.Path || JSON.stringify(value)
  }

  return String(value)
}

const escapeCsvValue = (value: unknown) => {
  const serializedValue = serializeValue(value)

  return /[",\r\n;]/.test(serializedValue) ? `"${serializedValue.replace(/"/g, '""')}"` : serializedValue
}

export const createCsvFromContents = (contents: GenericContent[], selectedColumns?: string[]) => {
  const columnNames = selectedColumns?.length ? selectedColumns : getColumnNames(contents)
  const header = columnNames.map(escapeCsvValue).join(',')
  const rows = contents.map((content) =>
    columnNames.map((columnName) => escapeCsvValue((content as any)[columnName])).join(','),
  )

  return [header, ...rows].join('\r\n')
}

export const downloadCsv = (csvContent: string, fileName: string) => {
  const blob = new Blob(['\uFEFF', csvContent], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const getCsvExportFileName = (contents: GenericContent[], parent?: GenericContent) => {
  const parentName = parent?.Name || 'sensenet-content'
  const timeStamp = new Date().toISOString().replace(/[:.]/g, '-')
  const suffix = contents.length === 1 ? contents[0].Name || contents[0].Id : `${contents.length}-items`

  return `${parentName}-${suffix}-${timeStamp}.csv`.replace(/[\\/:*?"<>|]/g, '_')
}
