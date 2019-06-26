import React, { ComponentType } from 'react'
import { reactControlMapper, ReactClientFieldSetting } from '@sensenet/controls-react'
import { ActionName } from '@sensenet/control-mapper'
import { Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'

interface Options {
  actionName: ActionName
  repository: Repository
  content: GenericContent
  component: ComponentType<ReactClientFieldSetting>
  fieldName: string
}

export function DynamicControl({ actionName, repository, content, component, fieldName }: Options) {
  const schema = reactControlMapper(repository).getFullSchemaForContentType(content.Type, actionName)
  const settings = schema.fieldMappings.find(a => a.fieldSettings.Name === fieldName)!.fieldSettings
  return component ? React.createElement(component, { settings, actionName, repository, content }) : null
}
