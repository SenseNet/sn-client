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
import { CollectionComponent } from '../ContentListPanel'
import { CommanderRouteParams } from './Commander'

export const SimpleListComponent: React.FunctionComponent<RouteComponentProps<{ folderId?: string }>> = props => {
  const getLeftFromPath = (params: CommanderRouteParams) =>
    parseInt(params.folderId as string, 10) || ConstantContent.PORTAL_ROOT.Id
  const [leftParentId, setLeftParentId] = useState(getLeftFromPath(props.match.params))
  const contentRouter = useContentRouting()
  const selectionService = useSelectionService()

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
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <LoadSettingsContextProvider>
        <CurrentContentProvider idOrPath={leftParentId}>
          <CurrentChildrenProvider>
            <CurrentAncestorsProvider>
              <CollectionComponent
                enableBreadcrumbs={true}
                onActivateItem={item => {
                  props.history.push(contentRouter.getPrimaryActionUrl(item))
                }}
                style={{ flexGrow: 1, flexShrink: 0, maxHeight: '100%', width: '100%' }}
                onParentChange={p => {
                  setLeftParentId(p.Id)
                  props.history.push(contentRouter.getPrimaryActionUrl(p))
                }}
                parentId={leftParentId}
                onTabRequest={() => {
                  /** */
                }}
                onSelectionChange={sel => {
                  selectionService.selection.setValue(sel)
                }}
                onActiveItemChange={item => selectionService.activeContent.setValue(item)}
              />
              <AddButton />
            </CurrentAncestorsProvider>
          </CurrentChildrenProvider>
        </CurrentContentProvider>
      </LoadSettingsContextProvider>
    </div>
  )
}

const connected = withRouter(SimpleListComponent)
export { connected as SimpleList }
