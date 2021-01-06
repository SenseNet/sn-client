import { Repository } from '@sensenet/client-core'
import { SchemaStore } from '@sensenet/default-content-types'
import { GenericContentWithIsParent, ListPicker, useListPicker } from '@sensenet/pickers-react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Fade from '@material-ui/core/Fade'
import React, { useState } from 'react'

const contentPath = '/Root/Content'
const testRepository = new Repository({
  repositoryUrl: 'https://dev.demo.sensenet.com',
  requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId', 'DisplayName'],
  schemas: SchemaStore,
})

export const ExampleApp = () => {
  const renderError = (message: string) => {
    if (message === 'Access denied.') {
      return (
        <p>
          You need to <strong>login</strong> to{' '}
          <a href="https://dev.demo.sensenet.com" target="_blank" rel="noopener noreferrer">
            https://dev.demo.sensenet.com
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
  return (
    <ListPicker
      renderError={renderError}
      renderLoading={renderLoading}
      repository={testRepository}
      currentPath={contentPath}
    />
  )
}

export const ExampleAppWithHook = () => {
  const [selectedItem, setSelectedItem] = useState<GenericContentWithIsParent>()
  const { items, path, navigateTo, reload } = useListPicker<GenericContentWithIsParent>({
    currentPath: contentPath,
    repository: testRepository,
  })
  console.log({ selectedItem, path })

  return (
    <>
      <button onClick={() => reload()}>Reload</button>
      <ul>
        {items &&
          items.map((node) => (
            <li
              style={{ color: selectedItem && node.Id === selectedItem.Id ? 'red' : 'inherit', cursor: 'pointer' }}
              onClick={() => setSelectedItem(node.isParent ? undefined : node)}
              onDoubleClick={() => navigateTo(node)}
              key={node.Id}>
              {node.isParent ? '..' : node.DisplayName}
            </li>
          ))}
      </ul>
    </>
  )
}
