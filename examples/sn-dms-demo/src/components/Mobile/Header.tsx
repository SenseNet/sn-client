import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import { ActionModel, GenericContent } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import React from 'react'
import { connect } from 'react-redux'
import * as DMSActions from '../../Actions'
import { getContentTypeFromUrl, getExtensionFromUrl } from '../../assets/helpers'
import { rootStateType } from '../../store/rootReducer'
import AppBarLogo from '../AppBarLogo'
import AddNewDialog from '../Dialogs/AddNewDialog'
import { Search } from '../Search/Search'

const styles = {
  appBar: {
    background: '#4cc9f2',
    zIndex: 1210,
    boxShadow: 'none',
  },
  menuButton: {
    marginLeft: -12,
    height: 36,
  },
  plusButton: {
    height: 36,
  },
}

const mapStateToProps = (state: rootStateType) => {
  return {
    actions: state.dms.actionmenu.addNewTypes,
    menuIsOpen: state.dms.menuOpen,
    currentContent: state.dms.documentLibrary.parent,
  }
}

const mapDispatchToProps = {
  getActions: DMSActions.loadTypesToAddNewList,
  openMenu: DMSActions.handleDrawerMenu,
  closeActionMenu: DMSActions.closeActionMenu,
  openActionMenu: DMSActions.openActionMenu,
  openDialog: DMSActions.openDialog,
  closeDialog: DMSActions.closeDialog,
  uploadFileList: DMSActions.uploadFileList,
}

interface MobileHeaderProps {
  actions: ActionModel[]
}

interface MobileHeaderState {
  open: boolean
  addNewOptions: ActionModel[]
  currentContent: GenericContent | null
}

interface a extends ActionModel {
  [key: string]: any
}

class MobileHeader extends React.Component<
  MobileHeaderProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  MobileHeaderState
> {
  public state = {
    open: this.props.menuIsOpen,
    addNewOptions: [],
    currentContent: null,
  }
  constructor(props: MobileHeader['props']) {
    super(props)

    this.handleAddNewClick = this.handleAddNewClick.bind(this)
  }
  public handleClick = () => {
    this.props.openMenu(!this.props.menuIsOpen)
    this.setState({
      open: !this.state.open,
    })
  }
  public handleAddNewClick = (e: React.MouseEvent<HTMLElement>) => {
    const { addNewOptions } = this.state
    this.props.closeActionMenu()
    this.props.currentContent &&
      this.props.openActionMenu(
        addNewOptions,
        this.props.currentContent,
        this.props.currentContent.Name,
        e.currentTarget,
        {
          top: (e.target as HTMLElement).offsetTop + 45,
          left: (e.target as HTMLElement).offsetLeft,
        },
      )
  }
  public static getDerivedStateFromProps(newProps: MobileHeader['props'], lastState: MobileHeader['state']) {
    if (
      newProps.currentContent &&
      newProps.currentContent.Id &&
      lastState.currentContent !== newProps.currentContent &&
      lastState.addNewOptions.length === 0
    ) {
      newProps.getActions(newProps.currentContent.Id)
    }
    const uploadList: Array<Partial<ActionModel>> = [
      {
        DisplayName: 'Upload file',
        Icon: 'file',
        Name: 'uploadFile',
      },
      {
        DisplayName: 'Upload folder',
        Icon: 'folder',
        Name: 'uploadFolder',
      },
    ]
    const optionList: ActionModel[] = []
    const folderList: ActionModel[] = []
    if (lastState.addNewOptions.length !== newProps.actions.length) {
      newProps.actions.map((action: a) => {
        const contentType = action.Url.includes('ContentType') ? getContentTypeFromUrl(action.Url) : null
        const extension = contentType === 'File' ? getExtensionFromUrl(action.Url) : null
        const displayName =
          action.DisplayName.indexOf('New') === -1 ? action.DisplayName : action.DisplayName.substring(3)
        const newDisplayName =
          action.DisplayName.indexOf('New') === -1 ? `New ${action.DisplayName.toLowerCase()}` : action.DisplayName
        action.DisplayName = newDisplayName
        action['Action'] = () => {
          newProps.closeActionMenu()
          newProps.openDialog(
            <AddNewDialog
              parentPath={newProps.currentContent ? newProps.currentContent.Path : ''}
              contentTypeName={contentType || ''}
              extension={extension || ''}
              title={contentType === 'File' ? displayName : contentType ? contentType.toLowerCase() : ''}
            />,
            newDisplayName,
            newProps.closeDialog,
          )
        }
        if (action.DisplayName.indexOf('folder') > -1) {
          if (action.DisplayName.indexOf('smart') === -1) {
            folderList.push(action)
          }
        } else {
          optionList.push(action)
        }
      })
    }
    return {
      ...lastState,
      currentContent: newProps.currentContent,
      addNewOptions:
        lastState.addNewOptions.length !== newProps.actions.length
          ? [...uploadList, ...optionList, ...folderList]
          : lastState.addNewOptions,
    }
  }
  public render() {
    return (
      <AppBar position="absolute" style={styles.appBar}>
        <Toolbar style={{ minHeight: 36, padding: '0px 0px 0px 10px' }}>
          <IconButton style={styles.menuButton} color="inherit" aria-label="Menu" onClick={() => this.handleClick()}>
            <Icon type={iconType.materialui} iconName="menu" style={{ color: '#fff' }} />
          </IconButton>
          <AppBarLogo />
          <div>
            <Search />
            <IconButton
              onClick={e => this.handleAddNewClick(e)}
              style={styles.plusButton}
              color="inherit"
              aria-label="Add new">
              <Icon type={iconType.materialui} iconName="add" style={{ color: '#fff' }} />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MobileHeader)
