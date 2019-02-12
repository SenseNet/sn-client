import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'

import { Injector } from '@furystack/inject'
import CircularProgress from '@material-ui/core/CircularProgress'
import ListItem from '@material-ui/core/ListItem/ListItem'
import { ODataCollectionResponse, ODataParams, Repository } from '@sensenet/client-core'
import { Folder, GenericContent } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import { ItemProps, ListPickerComponent } from '@sensenet/pickers-react'
import React from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import * as DMSActions from '../../Actions'
import { resources } from '../../assets/resources'
import { loadPickerItems, loadPickerParent, selectPickerItem, setBackLink } from '../../store/picker/actions'
import { rootStateType } from '../../store/rootReducer'
import AddNewDialog from '../Dialogs/AddNewDialog'

interface PathPickerProps {
  dialogComponent?: JSX.Element
  dialogTitle: string
  dialogCallback?: (...args: any[]) => void
  onSelect?: (content: GenericContent) => void
  mode: string
  showAddFolder?: boolean
  loadOptions?: ODataParams<GenericContent>
  currentPath?: string
}

const mapStateToProps = (state: rootStateType) => {
  return {
    selectedTarget: state.dms.picker.selected,
    items: state.dms.picker.items,
    pickerClose: state.dms.picker.pickerOnClose,
    parent: state.dms.picker.parent,
  }
}

const mapDispatchToProps = {
  selectPickerItem,
  loadPickerParent,
  loadPickerItems,
  openDialog: DMSActions.openDialog,
  closeDialog: DMSActions.closeDialog,
  setBackLink,
}

interface PathPickerState {
  items: GenericContent[]
}

class PathPicker extends React.Component<
  PathPickerProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  PathPickerState
> {
  public state = {
    items: this.props.items,
  }

  public handleClose = () => {
    this.props.pickerClose()
  }
  public handleSubmit = () => {
    const { dialogComponent, dialogTitle, dialogCallback } = this.props
    if (dialogComponent) {
      this.props.openDialog(dialogComponent, dialogTitle, this.handleAddNewClose, dialogCallback)
    }
    this.props.onSelect && this.props.onSelect(this.props.selectedTarget[0])
  }
  public isSelected = (id: number) => {
    return this.props.selectedTarget.findIndex(item => item.Id === id) > -1
  }

  public hasChildren = (id: number) => {
    const content = this.state.items.find(item => item.Id === id) as any
    if (!content) {
      return false
    }
    // tslint:disable-next-line:no-string-literal
    return content['Children']
      ? content.Children.filter((child: GenericContent) => child.IsFolder).length > 0
        ? true
        : false
      : false
  }
  public handleAddNewClose = () => {
    // TODO
  }
  public handleAddNewClick = () => {
    const { parent, openDialog } = this.props
    openDialog(
      <AddNewDialog parentPath={parent ? parent.Path : ''} contentTypeName="Folder" title="folder" />,
      resources.ADD_NEW,
      this.handleAddNewClose,
    )
  }

  public onSelectionChanged = (node: GenericContent) => {
    this.props.selectPickerItem(node)
  }

  public loadItems = async (path: string) => {
    let result: ODataCollectionResponse<Folder>
    const repository = Injector.Default.GetInstance(Repository)
    const pickerItemOptions: ODataParams<any> = {
      select: ['DisplayName', 'Path', 'Id', 'Children/IsFolder'],
      expand: ['Children'],
      filter: "(isOf('Folder') and not isOf('SystemFolder'))",
      metadata: 'no',
      orderby: 'DisplayName',
    }

    try {
      result = await repository.loadCollection<Folder>({
        path,
        oDataOptions: { ...(pickerItemOptions as any) },
      })
    } catch (error) {
      throw error
    }

    this.setState({ items: result.d.results })
    return result.d.results.map(content => {
      return { nodeData: content }
    })
  }

  public loadParent = async (id?: number) => {
    const pickerParentOptions: ODataParams<GenericContent> = {
      select: ['DisplayName', 'Path', 'Id', 'ParentId', 'Workspace'],
      expand: ['Workspace'],
      metadata: 'no',
    }
    const repository = Injector.Default.GetInstance(Repository)
    const result = await repository.load<GenericContent>({
      idOrPath: id as number,
      oDataOptions: { ...pickerParentOptions },
    })
    return { nodeData: result.d }
  }

  public renderItem = (renderItemProps: ItemProps<GenericContent>) => (
    <ListItem button={true} selected={this.isSelected(renderItemProps.nodeData.Id)}>
      <ListItemIcon>
        <Icon type={iconType.materialui} iconName="folder" />
      </ListItemIcon>
      <ListItemText primary={renderItemProps.nodeData!.DisplayName} />
      {this.hasChildren(renderItemProps.nodeData.Id) ? (
        <Icon type={iconType.materialui} iconName="keyboard_arrow_right" />
      ) : null}
    </ListItem>
  )

  public render() {
    const { selectedTarget } = this.props
    return (
      <>
        <DialogContent>
          <Scrollbars
            style={{ height: 240, width: 'calc(100% - 1px)' }}
            renderThumbVertical={({ style }) => (
              <div style={{ ...style, borderRadius: 2, backgroundColor: '#999', width: 10, marginLeft: -2 }} />
            )}
            thumbMinSize={180}>
            <ListPickerComponent
              onSelectionChanged={this.onSelectionChanged}
              renderLoading={() => <CircularProgress size={50} />}
              renderItem={this.renderItem}
              loadItems={this.loadItems}
              loadParent={this.loadParent}
              currentPath={this.props.currentPath ? this.props.currentPath : ''}
            />
          </Scrollbars>
        </DialogContent>

        <MediaQuery minDeviceWidth={700}>
          {matches => (
            <DialogActions className="mobile-picker-buttonRow">
              {this.props.showAddFolder === false ? null : (
                <div>
                  <IconButton onClick={() => this.handleAddNewClick()}>
                    <Icon type={iconType.materialui} iconName="create_new_folder" style={{ color: '#016D9E' }} />
                  </IconButton>
                  <Typography
                    style={{ flexGrow: 1, color: '#016D9E', fontFamily: 'Raleway Medium', fontSize: 14 }}
                    onClick={() => this.handleAddNewClick()}>
                    {matches ? null : resources.NEW_FOLDER}
                  </Typography>
                </div>
              )}
              {matches ? (
                <Button color="default" style={{ marginRight: 20 }} onClick={() => this.handleClose()}>
                  {resources.CANCEL}
                </Button>
              ) : null}
              <Button
                onClick={() => this.handleSubmit()}
                variant="contained"
                className="disabled-mobile-button"
                disabled={selectedTarget.length > 0 ? false : true}
                color={matches ? 'primary' : 'default'}>
                {resources[`${this.props.mode.toUpperCase()}_BUTTON`]}
              </Button>
            </DialogActions>
          )}
        </MediaQuery>
      </>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PathPicker)
