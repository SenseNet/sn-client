import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  IconButton,
  TextField,
  Typography,
} from '@material-ui/core'
import { Close, DeleteOutline, DragIndicator, InfoOutlined, Restore } from '@material-ui/icons'
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'
import React, { useMemo, useState } from 'react'
import { useLocalization } from '../../hooks'
import { ColumnSettingsSource, LegacyColumnSetting, LegacyColumnSettings } from '../../services'
import { DialogTitle } from './dialog-title'
import { useDialog, useStyles } from '.'

export interface ColumnSettingsDialogProps {
  columnSettings?: LegacyColumnSetting[]
  availableColumns?: LegacyColumnSetting[]
  defaultColumns?: LegacyColumnSetting[]
  settingsSource?: ColumnSettingsSource
  setColumnSettings: (columnSettings: LegacyColumnSettings, targetIdOrPath?: string | number) => void | Promise<void>
}

const copyColumns = (columns?: LegacyColumnSetting[]) => (columns || []).map((column) => ({ ...column }))
const filterColumns = createFilterOptions<LegacyColumnSetting>({
  stringify: (column) => `${column.title || ''} ${column.field}`,
})

export const ColumnSettings = ({
  columnSettings,
  availableColumns = [],
  defaultColumns = [],
  settingsSource,
  setColumnSettings,
}: ColumnSettingsDialogProps) => {
  const dialogClasses = useStyles()
  const { closeLastDialog } = useDialog()
  const localization = useLocalization().columnSettingsDialog
  const [columns, setColumns] = useState<LegacyColumnSetting[]>(() =>
    copyColumns(columnSettings?.length ? columnSettings : defaultColumns),
  )
  const [draggedField, setDraggedField] = useState<string | null>(null)
  const [dragOverField, setDragOverField] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [editInheritedSettings, setEditInheritedSettings] = useState(false)

  const unusedColumns = useMemo(
    () => availableColumns.filter((candidate) => !columns.some((column) => column.field === candidate.field)),
    [availableColumns, columns],
  )
  const sourceInfo = useMemo(() => {
    if (!settingsSource) return undefined

    switch (settingsSource.kind) {
      case 'local':
        return {
          label: localization.local,
          path: settingsSource.effectiveSettingsPath,
          description: localization.localScope,
          saveLabel: localization.updateLocal,
          switchLabel: undefined,
        }
      case 'inherited':
        if (editInheritedSettings && settingsSource.effectiveSettingsOwnerPath) {
          return {
            label: localization.inherited,
            path: settingsSource.effectiveSettingsPath,
            description: localization.inheritedEditScope(settingsSource.effectiveSettingsOwnerPath),
            saveLabel: localization.updateInherited,
            switchLabel: localization.createLocalInstead,
          }
        }
        return {
          label: localization.inherited,
          path: settingsSource.effectiveSettingsPath,
          description: localization.inheritedScope(settingsSource.localSettingsPath || ''),
          saveLabel: localization.createOverride,
          switchLabel: settingsSource.effectiveSettingsOwnerPath ? localization.editInherited : undefined,
        }
      case 'none':
        return {
          label: localization.noRepositorySettings,
          description: localization.newScope(settingsSource.localSettingsPath || ''),
          saveLabel: localization.createOverride,
          switchLabel: undefined,
        }
      case 'explicit':
        return {
          label: localization.applicationConfiguration,
          description: localization.explicitScope,
          saveLabel: localization.save,
          switchLabel: undefined,
        }
      default:
        return undefined
    }
  }, [editInheritedSettings, localization, settingsSource])

  const addColumn = (column: LegacyColumnSetting | null) => {
    if (!column || columns.some((activeColumn) => activeColumn.field === column.field)) return
    setColumns((current) => [...current, { ...column }])
  }

  const moveColumn = (sourceIndex: number, targetIndex: number) => {
    if (sourceIndex === targetIndex || sourceIndex < 0 || targetIndex < 0 || targetIndex >= columns.length) return
    setColumns((current) => {
      const reordered = [...current]
      const [column] = reordered.splice(sourceIndex, 1)
      reordered.splice(targetIndex, 0, column)
      return reordered
    })
  }

  const finishDragging = () => {
    setDraggedField(null)
    setDragOverField(null)
  }

  const save = async () => {
    if (!columns.length) return
    setIsSaving(true)
    setSaveError('')
    try {
      await setColumnSettings(
        { columns },
        editInheritedSettings ? settingsSource?.effectiveSettingsOwnerPath : undefined,
      )
      closeLastDialog()
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : localization.saveFailed || 'Could not save column settings.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <DialogTitle>
        {localization.title}
        <IconButton aria-label={localization.close} className={dialogClasses.closeButton} onClick={closeLastDialog}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ maxHeight: '62vh', paddingTop: 4 }}>
        {sourceInfo && (
          <div
            data-test="column-settings-source"
            style={{
              display: 'flex',
              gap: 8,
              margin: '2px 0 8px',
              padding: '7px 9px',
              borderRadius: 4,
              background: 'rgba(127, 127, 127, 0.1)',
            }}>
            <InfoOutlined fontSize="small" color="action" style={{ flexShrink: 0, marginTop: 1 }} />
            <div style={{ minWidth: 0 }}>
              <Typography variant="caption" component="div">
                {localization.source}: <strong>{sourceInfo.label}</strong>
              </Typography>
              {sourceInfo.path && (
                <Typography
                  variant="caption"
                  component="div"
                  title={sourceInfo.path}
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontFamily: 'monospace',
                  }}>
                  {sourceInfo.path}
                </Typography>
              )}
              <Typography variant="caption" color="textSecondary" component="div" style={{ overflowWrap: 'anywhere' }}>
                {sourceInfo.description}
              </Typography>
              {sourceInfo.switchLabel && (
                <Button
                  color="primary"
                  size="small"
                  data-test="column-settings-switch-target"
                  disabled={isSaving}
                  onClick={() => setEditInheritedSettings((current) => !current)}
                  style={{ minWidth: 0, minHeight: 0, marginTop: 3, padding: 0, textTransform: 'none' }}>
                  {sourceInfo.switchLabel}
                </Button>
              )}
            </div>
          </div>
        )}
        <div style={{ marginBottom: 6 }}>
          <Typography variant="caption" component="div" style={{ marginBottom: 3 }}>
            {localization.addColumn}
          </Typography>
          <Autocomplete
            fullWidth
            size="small"
            openOnFocus
            options={unusedColumns}
            value={null}
            filterOptions={filterColumns}
            getOptionLabel={(column) => column.title || column.field}
            getOptionSelected={(option, value) => option.field === value.field}
            noOptionsText={localization.noFields}
            onChange={(_, column) => addColumn(column)}
            renderOption={(column) => (
              <div style={{ width: '100%', display: 'flex', alignItems: 'baseline', gap: 16 }}>
                <Typography variant="body2" style={{ flex: 1 }}>
                  {column.title || column.field}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {column.field}
                </Typography>
              </div>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder={localization.searchFields}
                inputProps={{ ...params.inputProps, 'data-test': 'column-settings-field-search' }}
              />
            )}
          />
        </div>

        {columns.map((column, index) => (
          <div
            key={column.field}
            data-test={`column-settings-row-${column.field.toLowerCase()}`}
            onDragOver={(event) => {
              if (!draggedField || draggedField === column.field) return
              event.preventDefault()
              event.dataTransfer.dropEffect = 'move'
              setDragOverField(column.field)
            }}
            onDrop={(event) => {
              event.preventDefault()
              const sourceField = draggedField || event.dataTransfer.getData('text/plain')
              moveColumn(
                columns.findIndex((item) => item.field === sourceField),
                index,
              )
              finishDragging()
            }}
            style={{
              display: 'flex',
              gap: 6,
              minHeight: 38,
              alignItems: 'center',
              borderRadius: 4,
              backgroundColor: dragOverField === column.field ? 'rgba(127, 127, 127, 0.18)' : 'transparent',
              opacity: draggedField === column.field ? 0.45 : 1,
            }}>
            <IconButton
              size="small"
              draggable
              data-test={`column-settings-drag-${column.field.toLowerCase()}`}
              aria-label={`${localization.reorderColumn}: ${column.field}`}
              title={localization.reorderColumn}
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = 'move'
                event.dataTransfer.setData('text/plain', column.field)
                setDraggedField(column.field)
              }}
              onDragEnd={finishDragging}
              onKeyDown={(event) => {
                if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
                event.preventDefault()
                moveColumn(index, index + (event.key === 'ArrowUp' ? -1 : 1))
              }}
              style={{ cursor: draggedField === column.field ? 'grabbing' : 'grab', flexShrink: 0 }}>
              <DragIndicator fontSize="small" />
            </IconButton>
            <Typography
              variant="caption"
              color="textSecondary"
              title={column.field}
              style={{ width: 160, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {column.field}
            </Typography>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder={column.field}
              value={column.title || ''}
              inputProps={{ 'aria-label': `${localization.columnTitle}: ${column.field}` }}
              onChange={(event) => {
                const title = event.target.value
                setColumns((current) =>
                  current.map((item, itemIndex) => (itemIndex === index ? { ...item, title } : item)),
                )
              }}
            />
            <div style={{ display: 'flex', flexShrink: 0 }}>
              <IconButton
                size="small"
                aria-label={localization.remove}
                title={column.field === 'Actions' ? localization.actionsRequired : localization.remove}
                disabled={column.field === 'Actions'}
                onClick={() => setColumns((current) => current.filter((_, itemIndex) => itemIndex !== index))}>
                <DeleteOutline fontSize="small" />
              </IconButton>
            </div>
          </div>
        ))}

        {!columns.length && (
          <Typography color="error" variant="caption">
            {localization.atLeastOne}
          </Typography>
        )}
        {saveError && (
          <Typography color="error" variant="caption">
            {localization.saveFailed}: {saveError}
          </Typography>
        )}
      </DialogContent>
      <DialogActions style={{ paddingTop: 4 }}>
        <Button
          size="small"
          startIcon={<Restore />}
          onClick={() => setColumns(copyColumns(defaultColumns))}
          disabled={isSaving}>
          {localization.reset}
        </Button>
        <div style={{ flex: 1 }} />
        <Button size="small" onClick={closeLastDialog} disabled={isSaving}>
          {localization.cancel}
        </Button>
        <Button
          size="small"
          color="primary"
          variant="contained"
          data-test="column-settings-save"
          onClick={save}
          disabled={isSaving || !columns.length}>
          {isSaving ? <CircularProgress size={18} color="inherit" /> : sourceInfo?.saveLabel || localization.save}
        </Button>
      </DialogActions>
    </>
  )
}

export default ColumnSettings
