import { ConstantContent } from '@sensenet/client-core'
import React, { useContext, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { ContentContextProvider } from '../../services/ContentContextProvider'
import { left } from '../../store/Commander'
import { createCommandListPanel } from '../ContentListPanel'
import { InjectorContext } from '../InjectorContext'

const SimpleListControl = createCommandListPanel(left)

export const SimpleListComponent: React.FunctionComponent<RouteComponentProps<{ leftParent?: string }>> = props => {
  const getLeftFromPath = () => parseInt(props.match.params.leftParent as string, 10) || ConstantContent.PORTAL_ROOT.Id
  const injector = useContext(InjectorContext)
  const [leftParentId, setLeftParentId] = useState(getLeftFromPath())

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <SimpleListControl
        onActivateItem={item => {
          props.history.push(injector.GetInstance(ContentContextProvider).getPrimaryActionUrl(item))
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
    </div>
  )
}

const connected = withRouter(SimpleListComponent)
export { connected as SimpleList }
