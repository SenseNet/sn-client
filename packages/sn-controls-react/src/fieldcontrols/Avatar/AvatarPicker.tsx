import Avatar from '@material-ui/core/Avatar'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { CSSProperties } from '@material-ui/core/styles/withStyles'
import AddCircle from '@material-ui/icons/AddCircle'
import { Upload } from '@sensenet/client-core'
import { ODataCollectionResponse, ODataParams, Repository } from '@sensenet/client-core'
import { Folder, GenericContent, User } from '@sensenet/default-content-types'
import { Icon } from '@sensenet/icons-react'
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
}
interface AvatarPickerState {
  items: GenericContent[]
  currentParent: string
  currentParentId: number | null
}

export class AvatarPicker extends Component<AvatarPickerProps, AvatarPickerState> {
  constructor(props: AvatarPickerProps) {
    super(props)
    this.state = {
      items: [],
      currentParent: this.props.path,
      currentParentId: null,
    }
  }
  public onSelectionChanged = (content: GenericContent) => {
    if (content.Type === 'Image') {
      this.props.select(content)
    }
  }
  public loadItems = async (path: string) => {
    let result: ODataCollectionResponse<Folder>
    const filter = "(isOf('Folder') and not isOf('SystemFolder')) or isOf('Image')"
    const pickerItemOptions: ODataParams<Folder> = {
      select: ['DisplayName', 'Path', 'Id', 'Children/IsFolder', 'IsFolder'] as any,
      expand: ['Children'] as any,
      filter,
      metadata: 'no',
      orderby: [['IsFolder', 'desc'], 'DisplayName'],
    }

    try {
      result = await this.props.repository.loadCollection<Folder>({
        path,
        oDataOptions: pickerItemOptions,
      })
    } catch (error) {
      throw error
    }

    this.setState({
      items: result.d.results,
      currentParent: path,
    })
    return result.d.results
  }

  public loadParent = async (id?: number) => {
    const pickerParentOptions: ODataParams<GenericContent> = {
      select: ['DisplayName', 'Path', 'Id', 'ParentId', 'Workspace'],
      expand: ['Workspace'],
      metadata: 'no',
    }
    const result = await this.props.repository.load<GenericContent>({
      idOrPath: id as number,
      oDataOptions: { ...pickerParentOptions },
    })
    this.setState({
      currentParent: result.d.Path,
      currentParentId: id || null,
    })
    return result.d as GenericContent
  }
  public iconName = (node: GenericContent) => {
    switch (node.IsFolder) {
      case true:
        return 'folder'
        break
      default:
        return 'arrow_upward'
        break
    }
  }
  public renderItem = (node: GenericContent | User) => (
    <ListItem button={true} selected={node.Id === this.props.selected.Id}>
      {node.IsFolder || node.IsFolder === undefined ? (
        <ListItemIcon>
          <Icon iconName={this.iconName(node)} />
        </ListItemIcon>
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
      (await Upload.fromFileList({
        fileList: e.target.files,
        createFolders: true,
        binaryPropertyName: 'Binary',
        overwrite: true,
        parentPath: this.state.currentParent,
        repository: this.props.repository,
      }))
    this.loadItems(this.state.currentParent)
  }
  public render() {
    return (
      <div>
        <ListPickerComponent
          onSelectionChanged={this.onSelectionChanged}
          onNavigation={this.props.change}
          repository={this.props.repository}
          currentPath={this.props.path}
          loadItems={this.loadItems}
          loadParent={this.loadParent}
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
            <AddCircle color="primary" fontSize="large" />
          </InputLabel>
        </div>
      </div>
    )
  }
}
