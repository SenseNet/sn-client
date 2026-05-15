import { CircularProgress, createStyles, IconButton, makeStyles, Theme, Tooltip } from '@material-ui/core'
import ArchiveIcon from '@material-ui/icons/Archive'
import DeleteIcon from '@material-ui/icons/Delete'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import TableChartIcon from '@material-ui/icons/TableChart'
import { CurrentContentContext, useLogger, useRepository } from '@sensenet/hooks-react'
import React, { useContext, useEffect, useState } from 'react'
import { useGlobalStyles } from '../globalStyles'
import { useLocalization, useSelectionService } from '../hooks'
import { downloadContentsAsZip } from '../services/zip-download'
import { CsvExportDialog } from './CsvExportDialog'
import { useDialog } from './dialogs'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    batchActionWrapper: {
      '& .MuiIconButton-root': {
        color: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
      },
      marginLeft: '12px',
      display: 'flex',
      alignItems: 'center',
      marginRight: '8px',
      height: '36px',
    },
    actionButton: {
      width: '40px',
      marginRight: '2px',
      '&:disabled': {
        opacity: 0.2,
      },
    },
  }),
)

export const BatchActions = () => {
  const selectionService = useSelectionService()
  const localization = useLocalization()
  const globalClasses = useGlobalStyles()
  const classes = useStyles()
  const { openDialog } = useDialog()
  const repository = useRepository()
  const logger = useLogger('BatchActions')
  const [selected, setSelected] = useState(selectionService.selection.getValue())
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isZipDownloading, setIsZipDownloading] = useState(false)
  const parent = useContext(CurrentContentContext)

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

  return (
    <div className={classes.batchActionWrapper} data-test="batch-actions">
      <Tooltip title={localization.batchActions.exportCsv} placement="bottom">
        <span>
          <IconButton
            className={classes.actionButton}
            data-test="batch-export-csv"
            aria-label="export-csv"
            disabled={selected.length === 0}
            onClick={() => setIsExportDialogOpen(true)}>
            <TableChartIcon />
          </IconButton>
        </span>
      </Tooltip>
      <CsvExportDialog
        open={isExportDialogOpen}
        selected={selected}
        parent={parent}
        onClose={() => setIsExportDialogOpen(false)}
      />
      <Tooltip title={localization.batchActions.downloadZip} placement="bottom">
        <span>
          <IconButton
            className={classes.actionButton}
            data-test="batch-download-zip"
            aria-label="download-zip"
            disabled={selected.length === 0 || isZipDownloading}
            onClick={downloadSelectedContentAsZip}>
            {isZipDownloading ? <CircularProgress size={22} color="inherit" /> : <ArchiveIcon />}
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={localization.batchActions.delete} placement="bottom">
        <span>
          <IconButton
            className={classes.actionButton}
            data-test="batch-delete"
            aria-label="delete"
            disabled={selected.length === 0}
            onClick={() =>
              openDialog({
                name: 'delete',
                props: { content: selected },
                dialogProps: { disableBackdropClick: true, disableEscapeKeyDown: true },
              })
            }>
            <DeleteIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={localization.batchActions.move} placement="bottom">
        <span>
          <IconButton
            className={classes.actionButton}
            data-test="batch-move"
            aria-label="move"
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
            <FileCopyIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={localization.batchActions.copy} placement="bottom">
        <span>
          <IconButton
            className={classes.actionButton}
            data-test="batch-copy"
            aria-label="copy"
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
            <FileCopyOutlinedIcon />
          </IconButton>
        </span>
      </Tooltip>
    </div>
  )
}
