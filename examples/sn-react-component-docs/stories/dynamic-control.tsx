import React, { ComponentType } from 'react'
import { ReactClientFieldSetting, reactControlMapper } from '@sensenet/controls-react'
import { ActionName } from '@sensenet/control-mapper'
import { Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { boolean, number, object, text } from '@storybook/addon-knobs'

interface Options {
  actionName: ActionName
  repository: Repository
  content: GenericContent
  component?: ComponentType<ReactClientFieldSetting>
  fieldName: string
}

function getFieldValue({ actionName, content, component, fieldName }: Options) {
  if (actionName === 'new') {
    return undefined
  }

  if (component && component.displayName === 'Boolean') {
    return boolean('fieldValue', content[fieldName])
  }

  if (component && component.displayName === 'Number') {
    return number('fieldValue', content[fieldName])
  }

  if (typeof content[fieldName] === 'object' || Array.isArray(content[fieldName])) {
    return object('fieldValue', content[fieldName])
  }

  return text('fieldValue', content[fieldName])
}

export function DynamicControl({ actionName, repository, content, component, fieldName }: Options) {
  const schema = reactControlMapper(repository).getFullSchemaForContentType(content.Type, actionName)
  const fieldMapping = schema.fieldMappings.find((a) => a.fieldSettings.Name === fieldName)
  if (!fieldMapping) {
    return <p>{`${actionName} view is not available for this component!`}</p>
  }
  const componentToRender =
    component || reactControlMapper(repository).getControlForContentField(content.Type, fieldName, actionName)
  return React.createElement(componentToRender, {
    settings: object('settings', fieldMapping.fieldSettings),
    actionName,
    repository,
    content: actionName !== 'new' ? object('content', content) : undefined,
    fieldValue: getFieldValue({ actionName, content, component: componentToRender, fieldName, repository }),
  })
}
