import { ODataCollectionResponse, ODataParams, Repository } from '@sensenet/client-core'
import { Folder, GenericContent, SchemaStore } from '@sensenet/default-content-types'
import { ListPickerComponent } from '@sensenet/pickers-react/src/ListPicker'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { storiesOf } from '@storybook/react'
import React from 'react'

export const testRepository = new Repository({
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

let isAccessDenied = false

const loadItems = async (path: string) => {
  let result: ODataCollectionResponse<Folder>
  isAccessDenied = false

  try {
    result = await testRepository.loadCollection<Folder>({
      path,
      oDataOptions: { ...pickerItemOptions },
    })
  } catch (error) {
    isAccessDenied = error.message === 'Access denied.'
    throw error
  }

  return result.d.results.map(content => {
    return { nodeData: content }
  })
}

const loadParent = async (idOrPath: number | string) => {
  const result = await testRepository.load<GenericContent>({
    idOrPath,
    oDataOptions: { ...pickerParentOptions },
  })
  return { nodeData: result.d }
}

storiesOf('ListPicker', module)
  .addDecorator(withInfo())
  .addDecorator(story => <div style={{ padding: '3rem' }}>{story()}</div>)
  .add('default', () => (
    <>
      <p style={!isAccessDenied ? { display: 'none' } : {}}>
        You need to <strong>login</strong> to{' '}
        <a href="https://dmsservice.demo.sensenet.com" target="_blank">
          https://dmsservice.demo.sensenet.com
        </a>{' '}
        to see this component working!
      </p>
      <ListPickerComponent
        loadParent={loadParent}
        loadItems={loadItems}
        onSelectionChanged={action('SelectionChanged')}
      />
    </>
  ))
