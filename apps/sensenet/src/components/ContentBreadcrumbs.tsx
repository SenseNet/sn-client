import { createStyles, IconButton, makeStyles, Theme, Tooltip } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import { GenericContent } from '@sensenet/default-content-types'
import { CurrentAncestorsContext, CurrentContentContext } from '@sensenet/hooks-react'
import React, { useContext, useEffect, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { useContentRouting, useLocalization, useSelectionService } from '../hooks'
import Breadcrumbs, { BreadcrumbItem } from './Breadcrumbs'
import { useDialog } from './dialogs'
import { ActionNameType } from './react-control-mapper'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    batchActionWrapper: {
      marginRight: '140px',
      ' & .MuiIconButton-root': {
        color: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
      },
    },
  })
})

export const ContentBreadcrumbsComponent: React.FunctionComponent<
  RouteComponentProps & {
    onItemClick?: (item: BreadcrumbItem<GenericContent>) => void
    setFormOpen?: (actionName: ActionNameType) => void
    batchActions?: boolean
  }
> = (props) => {
  const ancestors = useContext(CurrentAncestorsContext)
  const parent = useContext(CurrentContentContext)
  const contentRouter = useContentRouting()
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

  const setFormOpen = (actionName: ActionNameType) => {
    props.setFormOpen && props.setFormOpen(actionName)
  }

  return (
    <>
      <Breadcrumbs
        items={[
          ...ancestors.map((content) => ({
            displayName: content.DisplayName || content.Name,
            title: content.Path,
            url: contentRouter.getPrimaryActionUrl(content),
            content,
          })),
          {
            displayName: parent.DisplayName || parent.Name,
            title: parent.Path,
            url: contentRouter.getPrimaryActionUrl(parent),
            content: parent,
          },
        ]}
        onItemClick={(_ev, item) => {
          props.onItemClick
            ? props.onItemClick(item)
            : props.history.push(contentRouter.getPrimaryActionUrl(item.content))
        }}
        setFormOpen={(actionName) => setFormOpen(actionName)}
      />
      {props.batchActions && selected.length > 1 ? (
        <div className={classes.batchActionWrapper}>
          <Tooltip title={localization.batchActions.delete} placement="bottom">
            <IconButton
              aria-label="delete"
              onClick={() => {
                openDialog({ name: 'delete', props: { content: selected } })
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

const routed = withRouter(ContentBreadcrumbsComponent)
export { routed as ContentBreadcrumbs }
