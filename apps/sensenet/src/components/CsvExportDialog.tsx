import {
  Button,
  Checkbox,
  Chip,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core'
import { FieldSetting, FieldVisibility, GenericContent } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import React, { useEffect, useMemo, useState } from 'react'
import { useLocalization } from '../hooks'
import { createCsvFromContents, downloadCsv, getCsvExportFileName, preferredCsvColumns } from '../services/csv-export'
import { DialogTitle } from './dialogs'

type CsvFieldOption = {
  name: string
  displayName: string
  type: string
  visibleBrowse?: FieldVisibility
}

type CsvExportDialogProps = {
  open: boolean
  selected: GenericContent[]
  parent?: GenericContent
  onClose: () => void
}

const systemFieldOptions = preferredCsvColumns.map<CsvFieldOption>((fieldName) => ({
  name: fieldName,
  displayName: fieldName,
  type: 'System',
  visibleBrowse: FieldVisibility.Show,
}))
const exportRequestBatchSize = 8

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(2),
      minHeight: '420px',
    },
    layout: {
      display: 'grid',
      gridTemplateColumns: 'minmax(260px, 360px) 1fr',
      gap: theme.spacing(3),
      [theme.breakpoints.down('xs')]: {
        gridTemplateColumns: '1fr',
      },
    },
    fieldToolbar: {
      display: 'flex',
      gap: theme.spacing(1),
      margin: `${theme.spacing(1)}px 0`,
    },
    fieldList: {
      border: `1px solid ${theme.palette.divider}`,
      maxHeight: '300px',
      overflowY: 'auto',
      padding: theme.spacing(1),
    },
    fieldLabel: {
      alignItems: 'flex-start',
      display: 'flex',
      marginRight: 0,
      width: '100%',
    },
    fieldLabelText: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
    },
    fieldName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    fieldMeta: {
      color: theme.palette.text.secondary,
      fontSize: '0.75rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    selectedFields: {
      alignContent: 'flex-start',
      border: `1px solid ${theme.palette.divider}`,
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme.spacing(1),
      marginTop: theme.spacing(1),
      maxHeight: '300px',
      minHeight: '128px',
      overflowY: 'auto',
      padding: theme.spacing(1),
    },
    selectedFieldsHeader: {
      alignItems: 'center',
      display: 'flex',
      gap: theme.spacing(1),
      justifyContent: 'space-between',
    },
  }),
)

const getContentTypeNames = (contents: GenericContent[]) =>
  Array.from(new Set(contents.map((content) => content.Type).filter(Boolean))).sort((left, right) =>
    left.localeCompare(right),
  )

const getSortedFieldOptions = (fieldOptions: CsvFieldOption[]) =>
  [...fieldOptions].sort((left, right) => {
    const leftPreferredIndex = preferredCsvColumns.indexOf(left.name)
    const rightPreferredIndex = preferredCsvColumns.indexOf(right.name)

    if (leftPreferredIndex >= 0 || rightPreferredIndex >= 0) {
      if (leftPreferredIndex === -1) {
        return 1
      }
      if (rightPreferredIndex === -1) {
        return -1
      }
      return leftPreferredIndex - rightPreferredIndex
    }

    return left.displayName.localeCompare(right.displayName)
  })

const getFieldOptionsForContentType = (fieldSettings: FieldSetting[]) => {
  const fieldOptionsByName = new Map(systemFieldOptions.map((fieldOption) => [fieldOption.name, fieldOption]))

  fieldSettings.forEach((fieldSetting) => {
    fieldOptionsByName.set(fieldSetting.Name, {
      name: fieldSetting.Name,
      displayName: fieldSetting.DisplayName || fieldSetting.Name,
      type: fieldSetting.Type,
      visibleBrowse: fieldSetting.VisibleBrowse,
    })
  })

  return getSortedFieldOptions(Array.from(fieldOptionsByName.values()))
}

const getDefaultSelectedFields = (contentTypeFieldOptions: CsvFieldOption[][]) => {
  const fieldNames = new Set(preferredCsvColumns)

  contentTypeFieldOptions.forEach((fieldOptions) => {
    fieldOptions.forEach((fieldOption) => {
      if (fieldOption.visibleBrowse === FieldVisibility.Show) {
        fieldNames.add(fieldOption.name)
      }
    })
  })

  return Array.from(fieldNames)
}

const loadContentsForExport = async (
  contents: GenericContent[],
  loadContent: (content: GenericContent) => Promise<GenericContent>,
) => {
  const loadedContents: GenericContent[] = []

  for (let startIndex = 0; startIndex < contents.length; startIndex += exportRequestBatchSize) {
    const contentBatch = contents.slice(startIndex, startIndex + exportRequestBatchSize)
    const loadedBatch = await Promise.all(contentBatch.map(loadContent))
    loadedContents.push(...loadedBatch)
  }

  return loadedContents
}

export const CsvExportDialog: React.FC<CsvExportDialogProps> = ({ open, selected, parent, onClose }) => {
  const classes = useStyles()
  const localization = useLocalization()
  const logger = useLogger('CsvExportDialog')
  const repository = useRepository()
  const contentTypeNames = useMemo(() => getContentTypeNames(selected), [selected])
  const [activeContentType, setActiveContentType] = useState('')
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  const fieldOptionsByContentType = useMemo(() => {
    return contentTypeNames.reduce((optionsByType, contentTypeName) => {
      const schema = repository.schemas.getSchemaByName(contentTypeName)
      optionsByType[contentTypeName] = getFieldOptionsForContentType(schema.FieldSettings)

      return optionsByType
    }, {} as Record<string, CsvFieldOption[]>)
  }, [contentTypeNames, repository.schemas])

  useEffect(() => {
    if (!open) {
      return
    }

    setActiveContentType(contentTypeNames[0] || '')
    setSelectedFields(contentTypeNames.length ? getDefaultSelectedFields(Object.values(fieldOptionsByContentType)) : [])
    setSearchTerm('')
  }, [contentTypeNames, fieldOptionsByContentType, open])

  const activeFieldOptions = activeContentType ? fieldOptionsByContentType[activeContentType] || [] : []
  const filteredFieldOptions = activeFieldOptions.filter((fieldOption) => {
    const normalizedSearchTerm = searchTerm.toLocaleLowerCase()

    return (
      fieldOption.name.toLocaleLowerCase().includes(normalizedSearchTerm) ||
      fieldOption.displayName.toLocaleLowerCase().includes(normalizedSearchTerm) ||
      fieldOption.type.toLocaleLowerCase().includes(normalizedSearchTerm)
    )
  })

  const fieldLabelsByName = useMemo(() => {
    const labelsByName = new Map<string, string>()

    Object.values(fieldOptionsByContentType).forEach((fieldOptions) => {
      fieldOptions.forEach((fieldOption) => {
        if (!labelsByName.has(fieldOption.name)) {
          labelsByName.set(fieldOption.name, fieldOption.displayName)
        }
      })
    })

    return labelsByName
  }, [fieldOptionsByContentType])

  const getFieldLabel = (fieldName: string) => {
    const displayName = fieldLabelsByName.get(fieldName)

    return displayName && displayName !== fieldName ? `${displayName} (${fieldName})` : fieldName
  }

  const toggleField = (fieldName: string) => {
    setSelectedFields((currentFields) =>
      currentFields.includes(fieldName)
        ? currentFields.filter((currentField) => currentField !== fieldName)
        : [...currentFields, fieldName],
    )
  }

  const selectActiveContentTypeFields = () => {
    setSelectedFields((currentFields) =>
      Array.from(new Set([...currentFields, ...activeFieldOptions.map((fieldOption) => fieldOption.name)])),
    )
  }

  const clearActiveContentTypeFields = () => {
    const activeFieldNames = new Set(activeFieldOptions.map((fieldOption) => fieldOption.name))
    setSelectedFields((currentFields) => currentFields.filter((fieldName) => !activeFieldNames.has(fieldName)))
  }

  const exportSelectedContent = async () => {
    if (!selected.length || !selectedFields.length) {
      return
    }

    setIsExporting(true)

    try {
      const contents = await loadContentsForExport(selected, async (content) => {
        const response = await repository.load<GenericContent>({
          idOrPath: content.Id,
          oDataOptions: { select: 'all' },
        })

        return response.d
      })
      const csvContent = createCsvFromContents(contents, selectedFields)

      downloadCsv(csvContent, getCsvExportFileName(contents, parent))
      logger.information({
        message: localization.batchActions.exportCsvSuccess.replace('{0}', String(contents.length)),
        data: {
          relatedRepository: repository.configuration.repositoryUrl,
          details: {
            exportedContentCount: contents.length,
            selectedFieldCount: selectedFields.length,
          },
        },
      })
      onClose()
    } catch (error) {
      logger.error({
        message: localization.batchActions.exportCsvError,
        data: {
          error,
          relatedRepository: repository.configuration.repositoryUrl,
          details: {
            selectedContentCount: selected.length,
            selectedFields,
          },
        },
      })
    } finally {
      setIsExporting(false)
    }
  }

  const selectionSummary = localization.batchActions.exportCsvSelectionSummary
    .replace('{0}', String(selected.length))
    .replace('{1}', String(contentTypeNames.length))
  const selectedFieldSummary = localization.batchActions.exportCsvSelectedFieldCount.replace(
    '{0}',
    String(selectedFields.length),
  )

  return (
    <Dialog
      open={open}
      onClose={isExporting ? undefined : onClose}
      maxWidth="md"
      fullWidth
      data-test="csv-export-dialog">
      <DialogTitle>{localization.batchActions.exportCsvDialogTitle}</DialogTitle>
      <DialogContent className={classes.content}>
        <Typography variant="body2" color="textSecondary">
          {selectionSummary}
        </Typography>
        <div className={classes.layout}>
          <div>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="csv-export-content-type-label">
                {localization.batchActions.exportCsvContentType}
              </InputLabel>
              <Select
                labelId="csv-export-content-type-label"
                value={activeContentType}
                onChange={(event) => setActiveContentType(event.target.value as string)}
                label={localization.batchActions.exportCsvContentType}>
                {contentTypeNames.map((contentTypeName) => (
                  <MenuItem key={contentTypeName} value={contentTypeName}>
                    {contentTypeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              label={localization.batchActions.exportCsvSearchFields}
              variant="outlined"
              margin="normal"
              fullWidth
            />
            <div className={classes.fieldToolbar}>
              <Button size="small" onClick={selectActiveContentTypeFields} disabled={!activeFieldOptions.length}>
                {localization.batchActions.exportCsvSelectAllTypeFields}
              </Button>
              <Button size="small" onClick={clearActiveContentTypeFields} disabled={!activeFieldOptions.length}>
                {localization.batchActions.exportCsvClearTypeFields}
              </Button>
            </div>
            <div className={classes.fieldList} data-test="csv-export-field-list">
              {filteredFieldOptions.length ? (
                filteredFieldOptions.map((fieldOption) => (
                  <FormControlLabel
                    key={fieldOption.name}
                    className={classes.fieldLabel}
                    control={
                      <Checkbox
                        color="primary"
                        checked={selectedFields.includes(fieldOption.name)}
                        onChange={() => toggleField(fieldOption.name)}
                      />
                    }
                    label={
                      <span className={classes.fieldLabelText}>
                        <span className={classes.fieldName}>{fieldOption.displayName}</span>
                        <span className={classes.fieldMeta}>
                          {fieldOption.name} - {fieldOption.type}
                        </span>
                      </span>
                    }
                  />
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  {localization.batchActions.exportCsvNoFields}
                </Typography>
              )}
            </div>
          </div>
          <div>
            <div className={classes.selectedFieldsHeader}>
              <div>
                <Typography variant="subtitle2">{localization.batchActions.exportCsvSelectedFields}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {selectedFieldSummary}
                </Typography>
              </div>
              <Button
                size="small"
                onClick={() => setSelectedFields([])}
                disabled={!selectedFields.length || isExporting}>
                {localization.batchActions.exportCsvClearSelectedFields}
              </Button>
            </div>
            <div className={classes.selectedFields} data-test="csv-export-selected-fields">
              {selectedFields.length ? (
                selectedFields.map((fieldName) => (
                  <Chip
                    key={fieldName}
                    label={getFieldLabel(fieldName)}
                    onDelete={() =>
                      setSelectedFields((currentFields) =>
                        currentFields.filter((currentField) => currentField !== fieldName),
                      )
                    }
                  />
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  {localization.batchActions.exportCsvNoSelectedFields}
                </Typography>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isExporting}>
          {localization.forms.cancel}
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={exportSelectedContent}
          disabled={!selected.length || !selectedFields.length || isExporting}>
          {isExporting ? localization.batchActions.exportCsvExporting : localization.batchActions.exportCsvExportButton}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
