import { ConstantContent } from '@sensenet/client-core'
import React, { useContext, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { matchPath, RouteComponentProps, withRouter } from 'react-router'
import { InjectorContext } from '../../context/InjectorContext'
import { RepositoryContext } from '../../context/RepositoryContext'
import { ContentContextProvider } from '../../services/ContentContextProvider'
import { rootStateType } from '../../store'
import { left } from '../../store/Commander'
import { AddButton } from '../AddButton'
import Breadcrumbs, { BreadcrumbItem } from '../Breadcrumbs'
import { createContentListPanel } from '../ContentListPanel'
import { Tree } from '../tree/index'
import { CommanderRouteParams } from './Commander'

const ExploreControl = createContentListPanel(left, { fields: ['DisplayName', 'CreatedBy'] })

const mapStateToProps = (state: rootStateType) => ({
  ancestors: state.commander.left.ancestors,
  parent: state.commander.left.parent,
})

export const ExploreComponent: React.FunctionComponent<
  RouteComponentProps<{ folderId?: string }> & ReturnType<typeof mapStateToProps>
> = props => {
  const getLeftFromPath = (params: CommanderRouteParams) =>
    parseInt(params.folderId as string, 10) || ConstantContent.PORTAL_ROOT.Id
  const injector = useContext(InjectorContext)
  const [leftParentId, setLeftParentId] = useState(getLeftFromPath(props.match.params))
  const repo = useContext(RepositoryContext)

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
  }, [leftParentId])

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'column' }}>
      <Breadcrumbs
        content={props.ancestors.map(
          content =>
            ({
              displayName: content.DisplayName || content.Name,
              title: content.Path,
              url: injector.GetInstance(ContentContextProvider).getPrimaryActionUrl(content, repo),
              content,
            } as BreadcrumbItem),
        )}
        currentContent={{
          displayName: props.parent.DisplayName || props.parent.Name,
          title: props.parent.Path,
          url: injector.GetInstance(ContentContextProvider).getPrimaryActionUrl(props.parent, repo),
          content: props.parent,
        }}
        onItemClick={(_ev, item) => {
          setLeftParentId(item.content.Id)
          props.history.push(injector.GetInstance(ContentContextProvider).getPrimaryActionUrl(item.content, repo))
        }}
      />
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <Tree
          ancestorPaths={props.ancestors.map(a => a.Path)}
          style={{ flexGrow: 1, flexShrink: 0, borderRight: '1px solid rgba(128,128,128,.2)', overflow: 'auto' }}
          parentPath={ConstantContent.PORTAL_ROOT.Path}
          onItemClick={item => {
            setLeftParentId(item.Id)
            props.history.push(injector.GetInstance(ContentContextProvider).getPrimaryActionUrl(item, repo))
          }}
          activeItemId={leftParentId}
        />
        <ExploreControl
          enableBreadcrumbs={false}
          onActivateItem={item => {
            props.history.push(injector.GetInstance(ContentContextProvider).getPrimaryActionUrl(item, repo))
          }}
          style={{ flexGrow: 7, flexShrink: 0, maxHeight: '100%' }}
          onParentChange={p => {
            setLeftParentId(p.Id)
            props.history.push(injector.GetInstance(ContentContextProvider).getPrimaryActionUrl(p, repo))
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
