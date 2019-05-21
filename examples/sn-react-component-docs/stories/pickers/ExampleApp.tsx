import CircularProgress from '@material-ui/core/CircularProgress'
import Fade from '@material-ui/core/Fade'
import { Repository } from '@sensenet/client-core'
import { GenericContent, SchemaStore } from '@sensenet/default-content-types'
import { ListPickerComponent, useListPicker } from '@sensenet/pickers-react'
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
  const renderLoading = () => (
    <Fade in={true} unmountOnExit={true}>
      <CircularProgress />
    </Fade>
  )
  return <ListPickerComponent renderError={renderError} renderLoading={renderLoading} repository={testRepository} />
}

export const ExampleAppWithHook = () => {
  const { items, selectedItem, setSelectedItem, path, navigateTo, reload } = useListPicker<GenericContent>(
    testRepository,
  )
  console.log({ selectedItem, path })

  return (
    <>
      <button onClick={() => reload()}>Reload</button>
      <ul>
        {items &&
          items.map(node => (
            <li
              style={{ color: selectedItem && node.Id === selectedItem.Id ? 'red' : 'inherit', cursor: 'pointer' }}
              onClick={() => setSelectedItem(node)}
              onDoubleClick={() => navigateTo(node)}
              key={node.Id}>
              {node.isParent ? '..' : node.DisplayName}
            </li>
          ))}
      </ul>
    </>
  )
}
