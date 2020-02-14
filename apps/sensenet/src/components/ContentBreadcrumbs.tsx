import React, { useContext } from 'react'
import { CurrentAncestorsContext, CurrentContentContext } from '@sensenet/hooks-react'
import { GenericContent } from '@sensenet/default-content-types'
import { useHistory } from 'react-router'
import { ContentContextService, useRepoState } from '../services'
import Breadcrumbs, { BreadcrumbItem } from './Breadcrumbs'

export const ContentBreadcrumbs = (props: { onItemClick?: (item: BreadcrumbItem<GenericContent>) => void }) => {
  const ancestors = useContext(CurrentAncestorsContext)
  const parent = useContext(CurrentContentContext)
  const repository = useRepoState().getCurrentRepository()!
  const history = useHistory()
  const contentContextService = new ContentContextService(repository)

  return (
    <Breadcrumbs
      items={[
        ...ancestors.map(content => ({
          displayName: content.DisplayName || content.Name,
          title: content.Path,
          url: contentContextService.getPrimaryActionUrl(content),
          content,
        })),
        {
          displayName: parent.DisplayName || parent.Name,
          title: parent.Path,
          url: contentContextService.getPrimaryActionUrl(parent),
          content: parent,
        },
      ]}
      onItemClick={(_ev, item) => {
        props.onItemClick
          ? props.onItemClick(item)
          : history.push(contentContextService.getPrimaryActionUrl(item.content))
      }}
    />
  )
}
