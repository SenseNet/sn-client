import { ConstantContent } from '@sensenet/client-core'
import React, { useContext, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { ContentRoutingContext } from '../../context/ContentRoutingContext'
import { CurrentAncestorsProvider } from '../../context/CurrentAncestors'
import { CurrentChildrenProvider } from '../../context/CurrentChildren'
import { CurrentContentProvider } from '../../context/CurrentContent'
import { AddButton } from '../AddButton'
import { CollectionComponent } from '../ContentListPanel'

export const SimpleListComponent: React.FunctionComponent<RouteComponentProps<{ folderId?: string }>> = props => {
  const getLeftFromPath = () => parseInt(props.match.params.folderId as string, 10) || ConstantContent.PORTAL_ROOT.Id
  const [leftParentId, setLeftParentId] = useState(getLeftFromPath())
  const ctx = useContext(ContentRoutingContext)

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <CurrentContentProvider idOrPath={leftParentId}>
        <CurrentChildrenProvider>
          <CurrentAncestorsProvider>
            <CollectionComponent
              fields={['DisplayName']}
              enableBreadcrumbs={true}
              onActivateItem={item => {
                props.history.push(ctx.getPrimaryActionUrl(item))
              }}
              style={{ flexGrow: 1, flexShrink: 0, maxHeight: '100%' }}
              onParentChange={p => {
                setLeftParentId(p.Id)
              }}
              parentId={leftParentId}
              onTabRequest={() => {
                /** */
              }}
            />
            <AddButton />
          </CurrentAncestorsProvider>
        </CurrentChildrenProvider>
      </CurrentContentProvider>
    </div>
  )
}

const connected = withRouter(SimpleListComponent)
export { connected as SimpleList }
