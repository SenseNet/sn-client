import { ODataParams, Repository } from '@sensenet/client-core'
import { Folder, GenericContent, SchemaStore } from '@sensenet/default-content-types'
import { ListPickerComponent } from '@sensenet/pickers-react'
import React from 'react'

const testRepository = new Repository({
  repositoryUrl: 'https://dmsservice.demo.sensenet.com',
  requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId', 'DisplayName'],
  schemas: SchemaStore,
  sessionLifetime: 'expiration',
})

const pickerItemOptions: ODataParams<Folder> = {
  select: ['DisplayName', 'Path', 'Id'],
  filter: "(isOf('Folder') and not isOf('SystemFolder'))",
  metadata: 'no',
  orderby: 'DisplayName',
}

const pickerParentOptions: ODataParams<GenericContent> = {
  select: ['DisplayName', 'Path', 'Id', 'ParentId', 'Workspace'],
  expand: ['Workspace'],
  metadata: 'no',
}

export const ExampleApp = () => {
  const renderError = (message: string) => {
    if (message === 'Access denied.') {
      return (
        <p>
          You need to <strong>login</strong> to{' '}
          <a href="https://dmsservice.demo.sensenet.com" target="_blank">
            https://dmsservice.demo.sensenet.com
          </a>{' '}
          to see this component working!
        </p>
      )
    }
    return <p>{message}</p>
  }
  return (
    <ListPickerComponent
      renderError={renderError}
      repository={testRepository}
      itemsOdataOptions={pickerItemOptions}
      parentODataOptions={pickerParentOptions}
    />
  )
}
