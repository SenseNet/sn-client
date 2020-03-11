import { GenericContent } from '@sensenet/default-content-types'
import {
  CurrentAncestorsProvider,
  CurrentChildrenProvider,
  CurrentContentProvider,
  LoadSettingsContextProvider,
} from '@sensenet/hooks-react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import clsx from 'clsx'
import React, { useContext } from 'react'
import { ResponsivePersonalSetttings } from '../../context'
import { useSelectionService } from '../../hooks'
import { ContentList } from '../content-list/content-list'
import { globals, useGlobalStyles } from '../../globalStyles'
import { ContentBreadcrumbs } from '../ContentBreadcrumbs'
import TreeWithData from '../tree/tree-with-data'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    exploreWrapper: {
      display: 'flex',
      flexDirection: 'column',
    },
    breadcrumbsWrapper: {
      height: globals.common.drawerItemHeight,
      boxSizing: 'border-box',
      borderBottom: theme.palette.type === 'light' ? '1px solid #DBDBDB' : '1px solid rgba(255, 255, 255, 0.11)',
      paddingLeft: '15px',
    },
    treeAndDatagridWrapper: {
      display: 'flex',
      width: '100%',
      height: `calc(100% - ${globals.common.drawerItemHeight}px)`,
      position: 'relative',
    },
  })
})

export interface ExploreComponentProps {
  parentIdOrPath: number | string
  onNavigate: (newParent: GenericContent) => void
  onActivateItem: (item: GenericContent) => void
  fieldsToDisplay?: Array<keyof GenericContent>
  rootPath?: string
}

export const Explore: React.FunctionComponent<ExploreComponentProps> = props => {
  const selectionService = useSelectionService()
  const personalSettings = useContext(ResponsivePersonalSetttings)
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  if (!props.rootPath) {
    return null
  }

  return (
    <>
      <LoadSettingsContextProvider>
        <CurrentContentProvider idOrPath={props.parentIdOrPath}>
          <CurrentChildrenProvider>
            <CurrentAncestorsProvider root={props.rootPath}>
              <div className={clsx(classes.breadcrumbsWrapper, globalClasses.centeredVertical)}>
                <ContentBreadcrumbs onItemClick={i => props.onNavigate(i.content)} />
              </div>
              <div className={classes.treeAndDatagridWrapper}>
                <TreeWithData
                  onItemClick={item => {
                    selectionService.activeContent.setValue(item)
                    props.onNavigate(item)
                  }}
                  parentPath={props.rootPath}
                  activeItemIdOrPath={props.parentIdOrPath}
                />

                <ContentList
                  style={{ flexGrow: 7, flexShrink: 0, maxHeight: '100%' }}
                  enableBreadcrumbs={false}
                  fieldsToDisplay={props.fieldsToDisplay || personalSettings.content.fields}
                  onParentChange={props.onNavigate}
                  onActivateItem={props.onActivateItem}
                  onActiveItemChange={item => selectionService.activeContent.setValue(item)}
                  parentIdOrPath={props.parentIdOrPath}
                  onSelectionChange={sel => {
                    selectionService.selection.setValue(sel)
                  }}
                />
              </div>
            </CurrentAncestorsProvider>
          </CurrentChildrenProvider>
        </CurrentContentProvider>
      </LoadSettingsContextProvider>
    </>
  )
}
