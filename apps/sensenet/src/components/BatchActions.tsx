import { createStyles, IconButton, makeStyles, Theme, Tooltip } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import GetAppIcon from '@material-ui/icons/GetApp'
import { CurrentContentContext } from '@sensenet/hooks-react'
import React, { useContext, useEffect, useState } from 'react'
import { useGlobalStyles } from '../globalStyles'
import { useLocalization, useSelectionService } from '../hooks'
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
  const [selected, setSelected] = useState(selectionService.selection.getValue())
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const parent = useContext(CurrentContentContext)

  useEffect(() => {
    const selectedComponentsObserve = selectionService.selection.subscribe((newSelectedComponents) => {
      setSelected(newSelectedComponents)
    })

    return function cleanup() {
      selectedComponentsObserve.dispose()
    }
  }, [selectionService.selection])

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
            <GetAppIcon />
          </IconButton>
        </span>
      </Tooltip>
      <CsvExportDialog
        open={isExportDialogOpen}
        selected={selected}
        parent={parent}
        onClose={() => setIsExportDialogOpen(false)}
      />
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
