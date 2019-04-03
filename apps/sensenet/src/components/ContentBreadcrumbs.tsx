import { useContext } from 'react'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { ContentRoutingContext } from '../context/ContentRoutingContext'
import { CurrentAncestorsContext } from '../context/CurrentAncestors'
import { CurrentContentContext } from '../context/CurrentContent'
import Breadcrumbs, { BreadcrumbItem } from './Breadcrumbs'

export const ContentBreadcrumbsComponent: React.FunctionComponent<
  RouteComponentProps & { onItemClick?: (item: BreadcrumbItem) => void }
> = props => {
  const ancestors = useContext(CurrentAncestorsContext)
  const parent = useContext(CurrentContentContext)
  const ctx = useContext(ContentRoutingContext)

  return (
    <Breadcrumbs
      content={ancestors.map(
        content =>
          ({
            displayName: content.DisplayName || content.Name,
            title: content.Path,
            url: ctx.getPrimaryActionUrl(content),
            content,
          } as BreadcrumbItem),
      )}
      currentContent={{
        displayName: parent.DisplayName || parent.Name,
        title: parent.Path,
        url: ctx.getPrimaryActionUrl(parent),
        content: parent,
      }}
      onItemClick={(_ev, item) => {
        props.onItemClick ? props.onItemClick(item) : props.history.push(ctx.getPrimaryActionUrl(item.content))
      }}
    />
  )
}

const routed = withRouter(ContentBreadcrumbsComponent)
export { routed as ContentBreadcrumbs }
