import { createStyles, IconButton, makeStyles, Theme, Tooltip } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import { GenericContent } from '@sensenet/default-content-types'
import { CurrentAncestorsContext, CurrentContentContext, useRepository } from '@sensenet/hooks-react'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useLocalization, useSelectionService } from '../hooks'
import { getPrimaryActionUrl } from '../services'
import { BreadcrumbItem, Breadcrumbs } from './Breadcrumbs'
import { useDialog } from './dialogs'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    batchActionWrapper: {
      marginRight: '125px',
      ' & .MuiIconButton-root': {
        color: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
      },
    },
  })
})

type ContentBreadcrumbsProps = {
  onItemClick?: (item: BreadcrumbItem<GenericContent>) => void
  batchActions?: boolean
}

export const ContentBreadcrumbs = (props: ContentBreadcrumbsProps) => {
  const ancestors = useContext(CurrentAncestorsContext)
  const parent = useContext(CurrentContentContext)
  const repository = useRepository()
  const history = useHistory()
  const localization = useLocalization()
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
      <Breadcrumbs
        items={[
          ...ancestors.map((content) => ({
            displayName: content.DisplayName || content.Name,
            title: content.Path,
            url: getPrimaryActionUrl(content, repository),
            content,
          })),
          {
            displayName: parent.DisplayName || parent.Name,
            title: parent.Path,
            url: getPrimaryActionUrl(parent, repository),
            content: parent,
          },
        ]}
        onItemClick={(_ev, item) => {
          props.onItemClick ? props.onItemClick(item) : history.push(getPrimaryActionUrl(item.content, repository))
        }}
      />
      {props.batchActions && selected.length > 1 ? (
        <div className={classes.batchActionWrapper}>
          <Tooltip title={localization.batchActions.delete} placement="bottom">
            <IconButton
              aria-label="delete"
              onClick={() => {
                openDialog({
                  name: 'delete',
                  props: { content: selected },
                  dialogProps: { disableBackdropClick: true, disableEscapeKeyDown: true, open: false },
                })
              }}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={localization.batchActions.move} placement="bottom">
            <IconButton
              aria-label="move"
              onClick={() => {
                openDialog({
                  name: 'copy-move',
                  props: {
                    content: selected,
                    currentParent: parent,
                    operation: 'move',
                  },
                  dialogProps: { disableBackdropClick: true, disableEscapeKeyDown: true, open: false },
                })
              }}>
              <FileCopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={localization.batchActions.copy} placement="bottom">
            <IconButton
              aria-label="copy"
              onClick={() => {
                openDialog({
                  name: 'copy-move',
                  props: {
                    content: selected,
                    currentParent: parent,
                    operation: 'copy',
                  },
                  dialogProps: { disableBackdropClick: true, disableEscapeKeyDown: true, open: false },
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
