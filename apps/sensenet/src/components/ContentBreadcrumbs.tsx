import React, { useContext } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { CurrentAncestorsContext, CurrentContentContext } from '../context'
import { useContentRouting } from '../hooks'
import Breadcrumbs, { BreadcrumbItem } from './Breadcrumbs'

export const ContentBreadcrumbsComponent: React.FunctionComponent<
  RouteComponentProps & { onItemClick?: (item: BreadcrumbItem) => void }
> = props => {
  const ancestors = useContext(CurrentAncestorsContext)
  const parent = useContext(CurrentContentContext)
  const contentRouter = useContentRouting()

  return (
    <Breadcrumbs
      content={ancestors.map(content => ({
        displayName: content.DisplayName || content.Name,
        title: content.Path,
        url: contentRouter.getPrimaryActionUrl(content),
        content,
      }))}
      currentContent={{
        displayName: parent.DisplayName || parent.Name,
        title: parent.Path,
        url: contentRouter.getPrimaryActionUrl(parent),
        content: parent,
      }}
      onItemClick={(_ev, item) => {
        props.onItemClick
          ? props.onItemClick(item)
          : props.history.push(contentRouter.getPrimaryActionUrl(item.content))
      }}
    />
  )
}

const routed = withRouter(ContentBreadcrumbsComponent)
export { routed as ContentBreadcrumbs }
