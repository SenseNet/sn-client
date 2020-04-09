import { GenericContent } from '@sensenet/default-content-types'
import { CurrentAncestorsContext, CurrentContentContext, useRepository } from '@sensenet/hooks-react'
import React, { useContext } from 'react'
import { useHistory } from 'react-router'
import { ContentContextService } from '../services'
import Breadcrumbs, { BreadcrumbItem } from './Breadcrumbs'
import { ActionNameType } from './react-control-mapper'

type ContentBreadcrumbsProps = {
  onItemClick?: (item: BreadcrumbItem<GenericContent>) => void
  setFormOpen?: (actionName: ActionNameType) => void
}

export const ContentBreadcrumbs = (props: ContentBreadcrumbsProps) => {
  const ancestors = useContext(CurrentAncestorsContext)
  const parent = useContext(CurrentContentContext)
  const repository = useRepository()
  const history = useHistory()
  const contentRouter = new ContentContextService(repository)

  const setFormOpen = (actionName: ActionNameType) => {
    props.setFormOpen && props.setFormOpen(actionName)
  }

  return (
    <Breadcrumbs
      items={[
        ...ancestors.map((content) => ({
          displayName: content.DisplayName || content.Name,
          title: content.Path,
          url: contentRouter.getPrimaryActionUrl(content),
          content,
        })),
        {
          displayName: parent.DisplayName || parent.Name,
          title: parent.Path,
          url: contentRouter.getPrimaryActionUrl(parent),
          content: parent,
        },
      ]}
      onItemClick={(_ev, item) => {
        props.onItemClick ? props.onItemClick(item) : history.push(contentRouter.getPrimaryActionUrl(item.content))
      }}
      setFormOpen={(actionName) => setFormOpen(actionName)}
    />
  )
}
