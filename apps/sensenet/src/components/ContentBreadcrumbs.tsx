import { createStyles, makeStyles } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import { CurrentAncestorsContext, CurrentContentContext, useRepository } from '@sensenet/hooks-react'
import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { ResponsivePersonalSettings } from '../context'
import { useSelectionService } from '../hooks'
import { getPrimaryActionUrl } from '../services'
import { BatchActions } from './BatchActions'
import { BreadcrumbItem, Breadcrumbs } from './Breadcrumbs'
import CopyPath from './CopyPath'

const useStyles = makeStyles(() => {
  return createStyles({
    buttonsWrapper: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      minWidth: 0,
      marginLeft: '10px',
    },
    breadcrumbsArea: {
      display: 'flex',
      alignItems: 'center',
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

  return (
    <div className={classes.buttonsWrapper}>
      <div className={classes.breadcrumbsArea}>
        <div className={classes.copyPathArea}>
          <CopyPath copyText={parent.Path} />
        </div>
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
      </div>
      {props.batchActions && (
        <div className={classes.actionsArea}>
          <BatchActions />
        </div>
      )}
    </div>
  )
}
