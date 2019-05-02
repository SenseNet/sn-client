import { ConstantContent } from '@sensenet/client-core'
import React, { useContext, useEffect, useState } from 'react'
import { matchPath, RouteComponentProps, withRouter } from 'react-router'
import {
  ContentRoutingContext,
  CurrentAncestorsProvider,
  CurrentChildrenProvider,
  CurrentContentProvider,
  LoadSettingsContextProvider,
  RepositoryContext,
} from '../../context'
import { CollectionComponent } from '../ContentListPanel'

export interface CommanderRouteParams {
  folderId?: string
  rightParent?: string
}

export const Commander: React.FunctionComponent<RouteComponentProps<CommanderRouteParams>> = props => {
  const ctx = useContext(ContentRoutingContext)
  const repo = useContext(RepositoryContext)
  const getLeftFromPath = (params: CommanderRouteParams) =>
    parseInt(params.folderId as string, 10) || ConstantContent.PORTAL_ROOT.Id
  const getRightFromPath = (params: CommanderRouteParams) =>
    parseInt(params.rightParent as string, 10) || ConstantContent.PORTAL_ROOT.Id

  const [leftParentId, setLeftParentId] = useState(getLeftFromPath(props.match.params))
  const [rightParentId, setRightParentId] = useState(getRightFromPath(props.match.params))

  const [_leftPanelRef, setLeftPanelRef] = useState<null | any>(null)
  const [_rightPanelRef, setRightPanelRef] = useState<null | any>(null)

  useEffect(() => {
    const historyChangeListener = props.history.listen(location => {
      const match = matchPath(location.pathname, props.match.path)
      if (match) {
        if (getLeftFromPath(match.params) !== leftParentId) {
          setLeftParentId(getLeftFromPath(match.params))
        }
        if (getRightFromPath(match.params) !== rightParentId) {
          setRightParentId(getRightFromPath(match.params))
        }
      }
    })
    return () => {
      historyChangeListener()
    }
  }, [leftParentId, rightParentId])

  useEffect(() => {
    if (
      props.match.params.folderId !== leftParentId.toString() ||
      props.match.params.rightParent !== rightParentId.toString()
    ) {
      props.history.push(`/${btoa(repo.configuration.repositoryUrl)}/browse/${leftParentId}/${rightParentId}`)
    }
  }, [leftParentId, rightParentId])

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <LoadSettingsContextProvider>
        <CurrentContentProvider idOrPath={leftParentId}>
          <CurrentChildrenProvider>
            <CurrentAncestorsProvider>
              <CollectionComponent
                enableBreadcrumbs={true}
                onActivateItem={item => {
                  props.history.push(ctx.getPrimaryActionUrl(item))
                }}
                containerRef={r => setLeftPanelRef(r)}
                style={{ width: '100%', maxHeight: '100%' }}
                parentId={leftParentId}
                onParentChange={p => {
                  setLeftParentId(p.Id)
                }}
                onTabRequest={() => _rightPanelRef && _rightPanelRef.focus()}
              />
            </CurrentAncestorsProvider>
          </CurrentChildrenProvider>
        </CurrentContentProvider>
        <CurrentContentProvider idOrPath={rightParentId}>
          <CurrentChildrenProvider>
            <CurrentAncestorsProvider>
              <CollectionComponent
                enableBreadcrumbs={true}
                onActivateItem={item => {
                  props.history.push(ctx.getPrimaryActionUrl(item))
                }}
                containerRef={r => setRightPanelRef(r)}
                parentId={rightParentId}
                style={{ width: '100%', borderLeft: '1px solid rgba(255,255,255,0.3)', maxHeight: '100%' }}
                onParentChange={p2 => {
                  setRightParentId(p2.Id)
                }}
                onTabRequest={() => _leftPanelRef && _leftPanelRef.focus()}
              />
            </CurrentAncestorsProvider>
          </CurrentChildrenProvider>
        </CurrentContentProvider>
      </LoadSettingsContextProvider>
    </div>
  )
}

export default withRouter(Commander)
