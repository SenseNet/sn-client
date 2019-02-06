import { storiesOf } from '@storybook/react'
import React from 'react'

import { ODataParams, Repository } from '@sensenet/client-core'
import { GenericContent, SchemaStore } from '@sensenet/default-content-types'
import { ListPickerComponent } from '@sensenet/pickers-react/src/ListPicker'

export const testRepository = new Repository({
  repositoryUrl: 'https://dmsservice.demo.sensenet.com',
  requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId', 'DisplayName'] as any,
  schemas: SchemaStore,
  sessionLifetime: 'expiration',
})

const pickerItemOptions: ODataParams<any> = {
  select: ['DisplayName', 'Path', 'Id', 'Children/DisplayName'],
  expand: ['Children'],
  // tslint:disable-next-line:quotemark
  filter: "(isOf('Folder') and not isOf('SystemFolder'))",
  metadata: 'no',
  orderby: 'DisplayName',
}

const pickerParentOptions: ODataParams<GenericContent> = {
  select: ['DisplayName', 'Path', 'Id', 'ParentId', 'Workspace'],
  expand: ['Workspace'],
  metadata: 'no',
}

const loadItems = async (path: string) => {
  const result = await testRepository.loadCollection<GenericContent>({
    path,
    oDataOptions: { ...(pickerItemOptions as any) },
  })
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

storiesOf('ListPicker', module).add('default', () => (
  <ListPickerComponent loadParent={loadParent} loadItems={loadItems} />
))
