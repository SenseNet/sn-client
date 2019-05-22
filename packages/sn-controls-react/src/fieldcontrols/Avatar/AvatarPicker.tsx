import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import InputLabel from '@material-ui/core/InputLabel'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { CSSProperties } from '@material-ui/core/styles/withStyles'
import { ODataParams, Repository } from '@sensenet/client-core'
import { Folder, GenericContent } from '@sensenet/default-content-types'
import { useListPicker } from '@sensenet/pickers-react'
import React, { useRef } from 'react'

const UPLOAD = 'Upload'

const styles = {
  uploadContainer: {
    minHeight: 50,
    position: 'relative',
  } as CSSProperties,
}

interface AvatarPickerProps {
  change?: () => void
  select: (content: GenericContent) => void
  repository: Repository
  path: string
  allowedTypes?: string[]
  selected: GenericContent
  repositoryUrl: string
  renderIcon: (name: string) => JSX.Element
}

const pickerItemOptions: ODataParams<Folder> = {
  select: ['DisplayName', 'Path', 'Id', 'Children/IsFolder', 'IsFolder'] as any,
  expand: ['Children'] as any,
  filter: "(isOf('Folder') and not isOf('SystemFolder')) or isOf('Image')",
  metadata: 'no',
  orderby: [['IsFolder', 'desc'], 'DisplayName'],
}

export function AvatarPicker(props: AvatarPickerProps) {
  // TODO? handle error and loading?
  const { items, selectedItem, setSelectedItem, path, navigateTo, reload } = useListPicker<GenericContent>(
    props.repository,
    {
      currentPath: props.path,
      itemsODataOptions: pickerItemOptions,
    },
  )
  const input = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props['data-onChange']) {
      props['data-onChange']()
    }
    e.persist()
    e.target.files &&
      (await props.repository.upload.fromFileList({
        fileList: e.target.files,
        createFolders: true,
        binaryPropertyName: 'Binary',
        overwrite: true,
        parentPath: path,
      }))
    reload()
  }

  const iconName = (node: GenericContent) => (node.IsFolder ? 'folder' : 'arrow_upward')

  const onClickHandler = (_e: React.MouseEvent, node: GenericContent) => {
    setSelectedItem(node)
    if (node.Type === 'Image') {
      props.select(node)
    }
  }

  return (
    <div>
      <List>
        {items &&
          items.map(node => (
            <ListItem
              key={node.Id}
              onClick={e => onClickHandler(e, node)}
              onDoubleClick={() => navigateTo(node)}
              button={true}
              selected={selectedItem && node.Id === selectedItem.Id}>
              {node.IsFolder || node.IsFolder === undefined ? (
                <ListItemIcon>{props.renderIcon(iconName(node))}</ListItemIcon>
              ) : (
                <Avatar src={`${props.repositoryUrl}${node.Path}`} />
              )}
              <ListItemText primary={node.DisplayName} />
            </ListItem>
          ))}
      </List>
      <div style={styles.uploadContainer}>
        <input
          style={{ display: 'none' }}
          id="raised-button-file"
          ref={input}
          type="file"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpload(e)}
        />
        <InputLabel
          htmlFor="raised-button-file"
          onClick={() => input.current && input.current.click()}
          style={{ transform: 'translate(0, 58px) scale(1)', cursor: 'pointer' }}
          title={UPLOAD}>
          <IconButton>{props.renderIcon('add_circle')}</IconButton>
        </InputLabel>
      </div>
    </div>
  )
}
