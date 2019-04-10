import { Repository } from '@sensenet/client-core'
import { SchemaStore } from '@sensenet/default-content-types'
import { ListPickerComponent } from '@sensenet/pickers-react'
import React from 'react'

const testRepository = new Repository({
  repositoryUrl: 'https://dmsservice.demo.sensenet.com',
  requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId', 'DisplayName'],
  schemas: SchemaStore,
  sessionLifetime: 'expiration',
})

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
  return <ListPickerComponent renderError={renderError} repository={testRepository} />
}
