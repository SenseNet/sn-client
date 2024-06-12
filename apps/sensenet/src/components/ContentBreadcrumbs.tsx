import { createStyles, IconButton, makeStyles, Theme, Tooltip } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import { GenericContent } from '@sensenet/default-content-types'
import { CurrentAncestorsContext, CurrentContentContext, useRepository } from '@sensenet/hooks-react'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ResponsivePersonalSettings } from '../context'
import { useGlobalStyles } from '../globalStyles'
import { useLocalization, useSelectionService } from '../hooks'
import { getPrimaryActionUrl } from '../services'
import { BreadcrumbItem, Breadcrumbs } from './Breadcrumbs'
import { useDialog } from './dialogs'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    batchActionWrapper: {
      marginRight: '7.5%',
      ' & .MuiIconButton-root': {
        color: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
      },
      marginLeft: 'auto',
    },
    treeActionWrapper: {
      marginRight: '7.5%',
      ' & .MuiIconButton-root': {
        color: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
      },
      // marginLeft: '10px',
      borderLeft: theme.palette.type === 'light' ? '1px solid #DBDBDB' : '1px solid rgba(255, 255, 255, 0.11)',
    },
  })
})

type ContentBreadcrumbsProps<T extends GenericContent> = {
  onItemClick?: (item: BreadcrumbItem<T>) => void
  batchActions?: boolean
  treeActions?: boolean
}

export const ContentBreadcrumbs = <T extends GenericContent = GenericContent>(props: ContentBreadcrumbsProps<T>) => {
  const ancestors = useContext(CurrentAncestorsContext) as T[]
  const parent = useContext(CurrentContentContext) as T
  const uiSettings = useContext(ResponsivePersonalSettings)
  const repository = useRepository()
  const history = useHistory()
  const { location } = history
  const localization = useLocalization()
  const globalClasses = useGlobalStyles()
  const classes = useStyles()
  const { openDialog } = useDialog()
  const selectionService = useSelectionService()
  const [selected, setSelected] = useState(selectionService.selection.getValue())

  useEffect(() => {
    const selectedComponentsObserve = selectionService.selection.subscribe((newSelectedComponents) =>
      setSelected(newSelectedComponents),
    )

    return function cleanup() {
      selectedComponentsObserve.dispose()
    }
  }, [selectionService.selection])

  return (
    <>
      <Breadcrumbs<T>
        items={[
          ...ancestors.map((content) => ({
            displayName: content.DisplayName || content.Name,
            title: content.Path,
            url: getPrimaryActionUrl({ content, repository, uiSettings, location }),
            content,
          })),
          {
            displayName: parent.DisplayName || parent.Name,
            title: parent.Path,
            url: getPrimaryActionUrl({ content: parent, repository, uiSettings, location }),
            content: parent,
          },
        ]}
        onItemClick={(_ev, item) => {
          selectionService.activeContent.setValue(item.content)
          props.onItemClick
            ? props.onItemClick(item)
            : history.push(getPrimaryActionUrl({ content: item.content, repository, uiSettings, location }))
        }}
      />
      {props.treeActions && selected.length > 0 ? (
        <div className={classes.treeActionWrapper} data-test="tree-actions">
          <Tooltip title={localization.treeActions.delete} placement="bottom">
            <IconButton
              data-test="tree-delete"
              aria-label="delete"
              onClick={() => {
                openDialog({
                  name: 'delete',
                  props: { content: selected },
                  dialogProps: { disableBackdropClick: true, disableEscapeKeyDown: true },
                })
              }}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={localization.treeActions.move} placement="bottom">
            <IconButton
              data-test="tree-move"
              aria-label="move"
              onClick={() => {
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
              }}>
              <FileCopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={localization.treeActions.copy} placement="bottom">
            <IconButton
              data-test="tree-copy"
              aria-label="copy"
              onClick={() => {
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
              }}>
              <FileCopyOutlinedIcon />
            </IconButton>
          </Tooltip>
        </div>
      ) : null}
      {props.batchActions && selected.length > 0 ? (
        <div className={classes.batchActionWrapper} data-test="batch-actions">
          <Tooltip title={localization.batchActions.delete} placement="bottom">
            <IconButton
              data-test="batch-delete"
              aria-label="delete"
              onClick={() => {
                openDialog({
                  name: 'delete',
                  props: { content: selected },
                  dialogProps: { disableBackdropClick: true, disableEscapeKeyDown: true },
                })
              }}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={localization.batchActions.move} placement="bottom">
            <IconButton
              data-test="batch-move"
              aria-label="move"
              onClick={() => {
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
              }}>
              <FileCopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={localization.batchActions.copy} placement="bottom">
            <IconButton
              data-test="batch-copy"
              aria-label="copy"
              onClick={() => {
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
              }}>
              <FileCopyOutlinedIcon />
            </IconButton>
          </Tooltip>
        </div>
      ) : null}
    </>
  )
}
