import { useTheme } from '@material-ui/core/styles'
import AppsIcon from '@material-ui/icons/Apps'
import ArchiveIcon from '@material-ui/icons/Archive'
import CheckBoxOutlined from '@material-ui/icons/CheckBoxOutlined'
import Close from '@material-ui/icons/Close'
import DeleteIcon from '@material-ui/icons/Delete'
import EditOutlined from '@material-ui/icons/EditOutlined'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import TableChartIcon from '@material-ui/icons/TableChart'
import { CurrentContentContext, useLogger, useRepository } from '@sensenet/hooks-react'
import React, { useContext, useEffect, useState } from 'react'
import { useGlobalStyles } from '../globalStyles'
import { useLocalization, useSelectionService } from '../hooks'
import { supportsFullscreenEdit } from '../services'
import { downloadContentsAsZip } from '../services/zip-download'
import { useContextMenuActions } from './context-menu/use-context-menu-actions'
import { CsvExportDialog } from './CsvExportDialog'
import { useDialog } from './dialogs'
import { ExplorerActionMenu } from './ExplorerActionMenu'
import './batch-actions.css'

export const BatchActions = () => {
  const selectionService = useSelectionService()
  const localization = useLocalization()
  const globalClasses = useGlobalStyles()
  const theme = useTheme()
  const { openDialog } = useDialog()
  const repository = useRepository()
  const logger = useLogger('BatchActions')
  const [selected, setSelected] = useState(selectionService.selection.getValue())
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isZipDownloading, setIsZipDownloading] = useState(false)
  const parent = useContext(CurrentContentContext)
  const { runAction } = useContextMenuActions(selected[0] || parent, () => undefined)
  const selectedCountLabel = localization.contentViews.selectedCount.replace('{0}', String(selected.length))

  useEffect(() => {
    const selectedComponentsObserve = selectionService.selection.subscribe((newSelectedComponents) => {
      setSelected(newSelectedComponents)
    })

    return function cleanup() {
      selectedComponentsObserve.dispose()
    }
  }, [selectionService.selection])

  const downloadSelectedContentAsZip = async () => {
    if (!selected.length || isZipDownloading) {
      return
    }

    setIsZipDownloading(true)

    try {
      const result = await downloadContentsAsZip({ repository, contents: selected, parent })

      logger.information({
        message: localization.batchActions.downloadZipSuccess
          .replace('{0}', String(result.fileCount))
          .replace('{1}', String(result.folderCount)),
        data: {
          relatedRepository: repository.configuration.repositoryUrl,
          details: {
            fileCount: result.fileCount,
            folderCount: result.folderCount,
            skippedContentCount: result.skippedContentCount,
            fileName: result.fileName,
          },
        },
      })
    } catch (error) {
      logger.error({
        message: localization.batchActions.downloadZipError,
        data: {
          error,
          relatedRepository: repository.configuration.repositoryUrl,
          details: {
            selectedContentCount: selected.length,
          },
        },
      })
    } finally {
      setIsZipDownloading(false)
    }
  }

  const secondaryActions = [
    ...(selected.length === 1 && supportsFullscreenEdit(selected[0])
      ? [
          {
            id: 'content-fullscreen-edit-action',
            label: localization.settings.fullscreenEdit,
            icon: <EditOutlined />,
            onClick: () => runAction('EditBinary'),
          },
        ]
      : []),
    {
      id: 'batch-odata-actions',
      label: localization.customActions.oDataActionsDialog.menuTitle,
      icon: <AppsIcon />,
      disabled: selected.length !== 1,
      onClick: () =>
        openDialog({
          name: 'odata-actions',
          props: { content: selected[0] },
          dialogProps: { classes: { paper: globalClasses.pickerDialog } },
        }),
    },
    {
      id: 'batch-export-csv',
      label: localization.batchActions.exportCsv,
      icon: <TableChartIcon />,
      disabled: selected.length === 0,
      onClick: () => setIsExportDialogOpen(true),
    },
    {
      id: 'batch-download-zip',
      label: localization.batchActions.downloadZip,
      icon: isZipDownloading ? <span className="sn-selection-actions__spinner" /> : <ArchiveIcon />,
      disabled: selected.length === 0 || isZipDownloading,
      onClick: downloadSelectedContentAsZip,
    },
  ]

  if (!selected.length) return null

  return (
    <div
      className="sn-selection-actions"
      data-test="batch-actions"
      role="group"
      aria-label={localization.contentViews.selectionActions}
      style={
        {
          '--sn-selection-surface': theme.palette.background.paper,
          '--sn-selection-hover': theme.palette.action.hover,
          '--sn-selection-border': theme.palette.divider,
          '--sn-selection-text': theme.palette.text.primary,
          '--sn-selection-muted': theme.palette.text.secondary,
          '--sn-selection-accent': theme.palette.primary.main,
          '--sn-selection-active': theme.palette.action.selected,
        } as React.CSSProperties
      }>
      <div className="sn-selection-actions__selection">
        <span
          className="sn-selection-actions__count"
          data-test="selection-count"
          role="status"
          aria-label={selectedCountLabel}
          title={selectedCountLabel}>
          <CheckBoxOutlined aria-hidden="true" />
          <span>{selected.length}</span>
        </span>
        <button
          type="button"
          className="sn-selection-actions__clear"
          data-test="batch-clear-selection"
          aria-label={localization.contentViews.clearSelection}
          title={localization.contentViews.clearSelection}
          onClick={() => selectionService.selection.setValue([])}>
          <Close aria-hidden="true" />
        </button>
      </div>
      <div
        className="sn-selection-actions__commands"
        role="group"
        aria-label={localization.contentViews.selectionActions}>
        <div className="sn-selection-actions__primary">
          <button
            type="button"
            className="sn-selection-actions__button"
            data-test="batch-copy"
            title={localization.batchActions.copy}
            aria-label={localization.batchActions.copy}
            disabled={selected.length === 0}
            onClick={() =>
              openDialog({
                name: 'copy-move',
                props: {
                  content: selected,
                  currentParent: parent,
                  operation: 'copy',
                },
                dialogProps: {
                  disableBackdropClick: true,
                  disableEscapeKeyDown: true,
                  classes: { paper: globalClasses.pickerDialog },
                },
              })
            }>
            <FileCopyOutlinedIcon aria-hidden="true" />
            <span>{localization.copyMoveContentDialog.copy.copyButton}</span>
          </button>
          <button
            type="button"
            className="sn-selection-actions__button"
            data-test="batch-move"
            title={localization.batchActions.move}
            aria-label={localization.batchActions.move}
            disabled={selected.length === 0}
            onClick={() =>
              openDialog({
                name: 'copy-move',
                props: {
                  content: selected,
                  currentParent: parent,
                  operation: 'move',
                },
                dialogProps: {
                  disableBackdropClick: true,
                  disableEscapeKeyDown: true,
                  classes: { paper: globalClasses.pickerDialog },
                },
              })
            }>
            <FileCopyIcon aria-hidden="true" />
            <span>{localization.copyMoveContentDialog.move.copyButton}</span>
          </button>
          <button
            type="button"
            className="sn-selection-actions__button sn-selection-actions__button--danger"
            data-test="batch-delete"
            title={localization.batchActions.delete}
            aria-label={localization.batchActions.delete}
            disabled={selected.length === 0}
            onClick={() =>
              openDialog({
                name: 'delete',
                props: { content: selected },
                dialogProps: { disableBackdropClick: true, disableEscapeKeyDown: true },
              })
            }>
            <DeleteIcon aria-hidden="true" />
            <span>{localization.deleteContentDialog.deleteButton}</span>
          </button>
        </div>
        <span className="sn-selection-actions__separator" aria-hidden="true" />
        <div className="sn-selection-actions__more">
          <ExplorerActionMenu
            label={localization.contentViews.more}
            testId="batch-more-actions"
            items={secondaryActions}
          />
        </div>
      </div>
      <CsvExportDialog
        open={isExportDialogOpen}
        selected={selected}
        parent={parent}
        onClose={() => setIsExportDialogOpen(false)}
      />
    </div>
  )
}
