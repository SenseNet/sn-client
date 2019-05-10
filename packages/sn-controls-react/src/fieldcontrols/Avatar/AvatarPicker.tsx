import { IconButton } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { CSSProperties } from '@material-ui/core/styles/withStyles'
import { ODataParams, Repository } from '@sensenet/client-core'
import { Folder, GenericContent, User } from '@sensenet/default-content-types'
import { ListPickerComponent } from '@sensenet/pickers-react'
import React, { Component } from 'react'

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

interface AvatarPickerState {
  path: string
}

export class AvatarPicker extends Component<AvatarPickerProps, AvatarPickerState> {
  constructor(props: AvatarPicker['props']) {
    super(props)
    this.state = {
      path: this.props.path,
    }
  }
  public onSelectionChanged = (content: GenericContent) => {
    if (content.Type === 'Image') {
      this.props.select(content)
    }
  }
  public onNavigation = (path: string) => {
    this.setState({
      path,
    })
  }
  private pickerItemOptions: ODataParams<Folder> = {
    select: ['DisplayName', 'Path', 'Id', 'Children/IsFolder', 'IsFolder'] as any,
    expand: ['Children'] as any,
    filter: "(isOf('Folder') and not isOf('SystemFolder')) or isOf('Image')",
    metadata: 'no',
    orderby: [['IsFolder', 'desc'], 'DisplayName'],
  }

  public iconName = (node: GenericContent) => (node.IsFolder ? 'folder' : 'arrow_upward')

  public renderItem = (node: GenericContent | User) => (
    <ListItem button={true} selected={node.Id === this.props.selected.Id}>
      {node.IsFolder || node.IsFolder === undefined ? (
        <ListItemIcon>{this.props.renderIcon(this.iconName(node))}</ListItemIcon>
      ) : (
        <Avatar src={`${this.props.repositoryUrl}${node.Path}`} />
      )}
      <ListItemText primary={node.DisplayName} />
    </ListItem>
  )

  /**
   * returns a name from the given path
   */
  public getNameFromPath = (path: string) => path.replace(/^.*[\\\/]/, '')

  public handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props['data-onChange']) {
      this.props['data-onChange']()
    }
    e.persist()
    e.target.files &&
      (await this.props.repository.upload.fromFileList({
        fileList: e.target.files,
        createFolders: true,
        binaryPropertyName: 'Binary',
        overwrite: true,
        parentPath: this.state.path,
      }))
  }

  public render() {
    return (
      <div>
        <ListPickerComponent
          onSelectionChanged={this.onSelectionChanged}
          onNavigation={this.onNavigation}
          repository={this.props.repository}
          currentPath={this.props.path}
          itemsOdataOptions={this.pickerItemOptions}
          renderItem={this.renderItem}
        />
        <div style={styles.uploadContainer}>
          <Input
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleUpload(e)}
          />
          <InputLabel
            htmlFor="raised-button-file"
            style={{ transform: 'translate(0, 58px) scale(1)', cursor: 'pointer' }}
            title={UPLOAD}>
            <IconButton>{this.props.renderIcon('add_circle')}</IconButton>
          </InputLabel>
        </div>
      </div>
    )
  }
}
