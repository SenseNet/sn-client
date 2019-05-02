import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { Repository } from '@sensenet/client-core'
import { SchemaStore } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
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
  return <ListPickerComponent renderError={renderError} repository={testRepository} />
}

export const ExampleAppWithHook = () => {
  const { parent, items, getListItemProps, selectedItem, path } = useListPicker(testRepository)
  console.log({ selectedItem, path })

  return (
    <List>
      {parent !== undefined ? (
        <ListItem
          button={true}
          selected={selectedItem && parent.Id === selectedItem.Id}
          onClick={e => getListItemProps().onClick(e, parent)}
          onDoubleClick={e => getListItemProps().onDoubleClick(e, parent)}>
          <ListItemIcon>
            <Icon type={iconType.materialui} iconName="folder" style={{ color: 'yellow' }} />
          </ListItemIcon>
          <ListItemText primary={parent.DisplayName} />
        </ListItem>
      ) : null}
      {items &&
        items.map(node => (
          <ListItem
            button={true}
            selected={selectedItem && node.Id === selectedItem.Id}
            onClick={e => getListItemProps().onClick(e, node)}
            onDoubleClick={e => getListItemProps().onDoubleClick(e, node)}
            key={node.Id}>
            <ListItemIcon>
              <Icon type={iconType.materialui} iconName="folder" />
            </ListItemIcon>
            <ListItemText primary={node.DisplayName} />
          </ListItem>
        ))}
    </List>
  )
}
