import { ConstantContent } from '@sensenet/client-core'
import React, { useContext, useState } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { ContentContextProvider } from '../../services/ContentContextProvider'
import { rootStateType } from '../../store'
import { left } from '../../store/Commander'
import { AddButton } from '../AddButton'
import Breadcrumbs, { BreadcrumbItem } from '../Breadcrumbs'
import { createContentListPanel } from '../ContentListPanel'
import { InjectorContext } from '../InjectorContext'
import { Tree } from '../tree/index'

const ExploreControl = createContentListPanel(left, { fields: ['DisplayName', 'CreatedBy'] })

const mapStateToProps = (state: rootStateType) => ({
  ancestors: state.commander.left.ancestors,
  parent: state.commander.left.parent,
})

export const ExploreComponent: React.FunctionComponent<
  RouteComponentProps<{ folderId?: string }> & ReturnType<typeof mapStateToProps>
> = props => {
  const getLeftFromPath = () => parseInt(props.match.params.folderId as string, 10) || ConstantContent.PORTAL_ROOT.Id
  const injector = useContext(InjectorContext)
  const [leftParentId, setLeftParentId] = useState(getLeftFromPath())

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'column' }}>
      <Breadcrumbs
        content={props.ancestors.map(
          content =>
            ({
              displayName: content.DisplayName || content.Name,
              title: content.Path,
              url: injector.GetInstance(ContentContextProvider).getPrimaryActionUrl(content),
              content,
            } as BreadcrumbItem),
        )}
        currentContent={{
          displayName: props.parent.DisplayName || props.parent.Name,
          title: props.parent.Path,
          url: injector.GetInstance(ContentContextProvider).getPrimaryActionUrl(props.parent),
          content: props.parent,
        }}
        onItemClick={(_ev, item) => {
          setLeftParentId(item.content.Id)
          props.history.push(injector.GetInstance(ContentContextProvider).getPrimaryActionUrl(item.content))
        }}
      />
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <Tree
          ancestorPaths={props.ancestors.map(a => a.Path)}
          style={{ flexGrow: 1, flexShrink: 0, borderRight: '1px solid rgba(128,128,128,.2)', overflow: 'auto' }}
          parentPath={ConstantContent.PORTAL_ROOT.Path}
          onItemClick={item => {
            setLeftParentId(item.Id)
            props.history.push(injector.GetInstance(ContentContextProvider).getPrimaryActionUrl(item))
          }}
          activeItemId={leftParentId}
        />
        <ExploreControl
          enableBreadcrumbs={false}
          onActivateItem={item => {
            props.history.push(injector.GetInstance(ContentContextProvider).getPrimaryActionUrl(item))
          }}
          style={{ flexGrow: 7, flexShrink: 0, maxHeight: '100%' }}
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
    </div>
  )
}

const connected = withRouter(connect(mapStateToProps)(ExploreComponent))
export { connected as Explore }
