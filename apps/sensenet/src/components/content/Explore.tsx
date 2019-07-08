import { ConstantContent } from '@sensenet/client-core'
import React, { useEffect, useState } from 'react'
import { matchPath, RouteComponentProps, withRouter } from 'react-router'
import {
  CurrentAncestorsProvider,
  CurrentChildrenProvider,
  CurrentContentProvider,
  LoadSettingsContextProvider,
} from '../../context'
import { useContentRouting, useSelectionService } from '../../hooks'
import { AddButton } from '../AddButton'
import { ContentBreadcrumbs } from '../ContentBreadcrumbs'
import { CollectionComponent } from '../ContentListPanel'
import { Tree } from '../tree/index'
import { CommanderRouteParams } from './Commander'

export const ExploreComponent: React.FunctionComponent<RouteComponentProps<{ folderId?: string }>> = props => {
  const getLeftFromPath = (params: CommanderRouteParams) =>
    parseInt(params.folderId as string, 10) || ConstantContent.PORTAL_ROOT.Id

  const selectionService = useSelectionService()

  const contentRouter = useContentRouting()
  const [leftParentId, setLeftParentId] = useState(getLeftFromPath(props.match.params))
  useEffect(() => {
    const historyChangeListener = props.history.listen(location => {
      const match = matchPath(location.pathname, props.match.path)
      if (match) {
        if (getLeftFromPath(match.params) !== leftParentId) {
          setLeftParentId(getLeftFromPath(match.params))
        }
      }
    })
    return () => {
      historyChangeListener()
    }
  }, [leftParentId, props.history, props.match.path])

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'column' }}>
      <LoadSettingsContextProvider>
        <CurrentContentProvider idOrPath={leftParentId}>
          <CurrentChildrenProvider>
            <CurrentAncestorsProvider>
              <div style={{ marginTop: '13px', paddingBottom: '12px', borderBottom: '1px solid rgba(128,128,128,.2)' }}>
                <ContentBreadcrumbs />
              </div>
              <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                <Tree
                  style={{
                    flexGrow: 1,
                    flexShrink: 0,
                    borderRight: '1px solid rgba(128,128,128,.2)',
                    overflow: 'auto',
                  }}
                  parentPath={ConstantContent.PORTAL_ROOT.Path}
                  loadOptions={{
                    orderby: [['DisplayName', 'asc'], ['Name', 'asc']],
                  }}
                  onItemClick={item => {
                    selectionService.activeContent.setValue(item)
                    setLeftParentId(item.Id)
                    props.history.push(contentRouter.getPrimaryActionUrl(item))
                  }}
                  activeItemId={leftParentId}
                />

                <CollectionComponent
                  enableBreadcrumbs={false}
                  onActivateItem={item => {
                    props.history.push(contentRouter.getPrimaryActionUrl(item))
                  }}
                  style={{ flexGrow: 7, flexShrink: 0, maxHeight: '100%' }}
                  onParentChange={p => {
                    setLeftParentId(p.Id)
                    props.history.push(contentRouter.getPrimaryActionUrl(p))
                  }}
                  onSelectionChange={sel => {
                    selectionService.selection.setValue(sel)
                  }}
                  parentId={leftParentId}
                  onTabRequest={() => {
                    /** */
                  }}
                  onActiveItemChange={item => selectionService.activeContent.setValue(item)}
                />

                <AddButton />
              </div>
            </CurrentAncestorsProvider>
          </CurrentChildrenProvider>
        </CurrentContentProvider>
      </LoadSettingsContextProvider>
    </div>
  )
}

const routed = withRouter(ExploreComponent)

export { routed as Explore }
