import React, { useContext } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { CurrentAncestorsContext, CurrentContentContext } from '@sensenet/hooks-react'
import { GenericContent } from '@sensenet/default-content-types'
import { createStyles, IconButton, makeStyles, Theme, Tooltip } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import { useContentRouting, useLocalization } from '../hooks'
import Breadcrumbs, { BreadcrumbItem } from './Breadcrumbs'
import { ActionNameType } from './react-control-mapper'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    batchActionWrapper: {
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
  }
> = (props) => {
  const ancestors = useContext(CurrentAncestorsContext)
  const parent = useContext(CurrentContentContext)
  const contentRouter = useContentRouting()
  const localization = useLocalization()
  const classes = useStyles()

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
      <div className={classes.batchActionWrapper}>
        <Tooltip title={localization.batchActions.delete} placement="bottom">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={localization.batchActions.move} placement="bottom">
          <IconButton aria-label="move">
            <FileCopyIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={localization.batchActions.copy} placement="bottom">
          <IconButton aria-label="copy">
            <FileCopyOutlinedIcon />
          </IconButton>
        </Tooltip>
      </div>
    </>
  )
}

const routed = withRouter(ContentBreadcrumbsComponent)
export { routed as ContentBreadcrumbs }
