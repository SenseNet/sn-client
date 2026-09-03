import { Button, createStyles, IconButton, makeStyles, Tooltip } from '@material-ui/core'
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import { GenericContent } from '@sensenet/default-content-types'
import { CurrentAncestorsContext, CurrentContentContext, useRepository } from '@sensenet/hooks-react'
import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { ResponsiveContext, ResponsivePersonalSettings } from '../context'
import { useSelectionService } from '../hooks'
import { getPrimaryActionUrl } from '../services'
import { BatchActions } from './BatchActions'
import { BreadcrumbItem, Breadcrumbs } from './Breadcrumbs'
import CopyPath from './CopyPath'

const useStyles = makeStyles((theme) => {
  return createStyles({
    buttonsWrapper: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      minWidth: 0,
      marginLeft: '10px',
      overflow: 'hidden',
      [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
        width: '100%',
      },
    },
    desktopBreadcrumbs: {
      display: 'flex',
      alignItems: 'center',
      minWidth: 0,
      overflow: 'hidden',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    mobileLocation: {
      display: 'none',
      [theme.breakpoints.down('sm')]: {
        display: 'flex',
        alignItems: 'center',
        minWidth: 0,
        flex: '1 1 auto',
      },
    },
    mobileLocationButton: {
      minWidth: 0,
      maxWidth: '100%',
      paddingLeft: 4,
      paddingRight: 4,
      textTransform: 'none',
      justifyContent: 'flex-start',
      overflow: 'hidden',
      '& .MuiButton-label': {
        display: 'block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },
    mobileUpButton: {
      flex: '0 0 auto',
      padding: 6,
    },
    breadcrumbsArea: {
      display: 'flex',
      alignItems: 'center',
      flex: '1 1 auto',
      minWidth: 0,
      overflow: 'hidden',
    },
    copyPathArea: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
    },
    actionsArea: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
      marginLeft: 'auto',
    },
  })
})

type ContentBreadcrumbsProps<T extends GenericContent> = {
  onItemClick?: (item: BreadcrumbItem<T>) => void
  batchActions?: boolean
}

export const ContentBreadcrumbs = <T extends GenericContent = GenericContent>(props: ContentBreadcrumbsProps<T>) => {
  const ancestors = useContext(CurrentAncestorsContext) as T[]
  const parent = useContext(CurrentContentContext) as T
  const uiSettings = useContext(ResponsivePersonalSettings)
  const repository = useRepository()
  const history = useHistory()
  const { location } = history
  const classes = useStyles()
  const selectionService = useSelectionService()
  const device = useContext(ResponsiveContext)

  const items = [
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
  ]

  const handleItemClick = (item: BreadcrumbItem<T>) => {
    selectionService.activeContent.setValue(item.content)
    props.onItemClick
      ? props.onItemClick(item)
      : history.push(getPrimaryActionUrl({ content: item.content, repository, uiSettings, location }))
  }

  const parentItem = items[items.length - 1]
  const ancestorItem = items[items.length - 2]

  return (
    <div className={classes.buttonsWrapper}>
      <div className={classes.breadcrumbsArea}>
        {device === 'mobile' ? (
          <div className={classes.mobileLocation}>
            {ancestorItem ? (
              <Tooltip title={ancestorItem.title} placement="bottom">
                <IconButton
                  className={classes.mobileUpButton}
                  aria-label="Go up"
                  size="small"
                  onClick={() => handleItemClick(ancestorItem)}>
                  <ArrowUpward fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : null}
            <Tooltip title={parentItem.title} placement="bottom">
              <Button className={classes.mobileLocationButton} aria-label={parentItem.displayName}>
                {parentItem.displayName}
              </Button>
            </Tooltip>
          </div>
        ) : (
          <div className={classes.desktopBreadcrumbs}>
            <div className={classes.copyPathArea}>
              <CopyPath copyText={parent.Path} />
            </div>
            <Breadcrumbs<T> items={items} onItemClick={(_ev, item) => handleItemClick(item)} />
          </div>
        )}
      </div>
      {props.batchActions && (
        <div className={classes.actionsArea}>
          <BatchActions />
        </div>
      )}
    </div>
  )
}
