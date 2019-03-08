import { ConstantContent } from '@sensenet/client-core'
import React, { useContext, useState } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { InjectorContext } from '../../context/InjectorContext'
import { ContentContextProvider } from '../../services/ContentContextProvider'
import { rootStateType } from '../../store'
import { left } from '../../store/Commander'
import { AddButton } from '../AddButton'
import { createContentListPanel } from '../ContentListPanel'

const SimpleListControl = createContentListPanel(left, { fields: ['DisplayName'] })

export const mapStateToProps = (state: rootStateType) => ({
  parent: state.commander.left.parent,
})

export const SimpleListComponent: React.FunctionComponent<
  RouteComponentProps<{ leftParent?: string }> & ReturnType<typeof mapStateToProps>
> = props => {
  const getLeftFromPath = () => parseInt(props.match.params.leftParent as string, 10) || ConstantContent.PORTAL_ROOT.Id
  const injector = useContext(InjectorContext)
  const [leftParentId, setLeftParentId] = useState(getLeftFromPath())

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <SimpleListControl
        enableBreadcrumbs={true}
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
      <AddButton parent={props.parent} />
    </div>
  )
}

const connected = withRouter(connect(mapStateToProps)(SimpleListComponent))
export { connected as SimpleList }
