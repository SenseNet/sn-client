import { ODataCollectionResponse, ODataParams, Repository } from '@sensenet/client-core'
import { Folder, GenericContent, SchemaStore } from '@sensenet/default-content-types'
import React, { useState } from 'react'
import { hot } from 'react-hot-loader/root'
import { ListPickerComponent } from '../src/ListPicker/ListPicker'

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

const loadParent = async (id?: number) => {
  const result = await testRepository.load<GenericContent>({
    idOrPath: id as number,
    oDataOptions: { ...pickerParentOptions },
  })
  return { nodeData: result.d }
}

// tslint:disable-next-line: completed-docs
export const App = () => {
  const [isAccessDenied, setIsAccessDenied] = useState(false)

  const loadItems = async (path: string) => {
    let result: ODataCollectionResponse<Folder>

    try {
      result = await testRepository.loadCollection<Folder>({
        path,
        oDataOptions: { ...pickerItemOptions },
      })
    } catch (error) {
      setIsAccessDenied(error.message === 'Access denied.')
      throw error
    }

    return result.d.results.map(content => {
      return { nodeData: content }
    })
  }

  return (
    <div>
      <p style={!isAccessDenied ? { display: 'none' } : {}}>
        You need to <strong>login</strong> to{' '}
        <a href="https://dmsservice.demo.sensenet.com" target="_blank">
          https://dmsservice.demo.sensenet.com
        </a>{' '}
        to see this component working!
      </p>
      <ListPickerComponent loadItems={loadItems} loadParent={loadParent} />
    </div>
  )
}

export default hot(App)
