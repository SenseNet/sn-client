import IconButton from '@material-ui/core/IconButton'
import { ActionModel, GenericContent } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import { Actions } from '@sensenet/redux'
import React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import * as DMSActions from '../../Actions'
import { icons } from '../../assets/icons'
import { resources } from '../../assets/resources'
import { closePicker, deselectPickeritem, openPicker } from '../../store/picker/actions'
import { rootStateType } from '../../store/rootReducer'
import CopyToConfirmDialog from '../Dialogs/CopyToConfirmDialog'
import DeleteDialog from '../Dialogs/DeleteDialog'
import MoveToConfirmDialog from '../Dialogs/MoveToConfirmDialog'
import PathPickerDialog from '../Pickers/PathPickerDialog'

const styles = {
  icon: {
    display: 'inline-block',
  },
  hidden: {
    display: 'none',
  },
  actionmenuContainer: {
    flex: 1,
  },
  menuIcon: {
    color: '#fff',
    display: 'inline-block',
    verticalAlign: 'middle',
    cursor: 'pointer',
    height: 36,
  },
  menuIconMobile: {
    width: 'auto' as any,
    marginLeft: '16px',
  },
  arrowButton: {
    marginLeft: 0,
  },
  menu: {
    marginTop: 45,
    padding: 0,
  },
  menuItem: {
    padding: '6px 15px',
    minHeight: 24,
    fontSize: '0.9rem',
  },
  actionIcon: {
    color: '#016D9E',
  },
}

interface BatchActionListProps {
  currentContent?: GenericContent
  selected: GenericContent[]
}

const mapStateToProps = (state: rootStateType) => {
  return {
    actions: state.dms.toolbar.actions,
    currentId: state.dms.currentId,
    currentParent: state.dms.documentLibrary.parent,
  }
}

const mapDispatchToProps = {
  getActions: DMSActions.getListActions,
  openActionMenu: DMSActions.openActionMenu,
  closeActionMenu: DMSActions.closeActionMenu,
  clearSelection: Actions.clearSelection,
  openDialog: DMSActions.openDialog,
  deselectPickeritem,
  openPicker,
  closePicker,
}

export interface BatchActionlistState {
  options: ActionModel[]
  currentId: number
  anchorEl: HTMLElement | null
  actions: ActionModel[]
}

class BatchActionlist extends React.Component<
  BatchActionListProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  BatchActionlistState
> {
  public state = {
    currentId: 0, // this.props.currentContent && this.props.currentContent.Id || 0,
    options: [],
    anchorEl: null,
    actions: [],
  }
  constructor(props: BatchActionlist['props']) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  public static getDerivedStateFromProps(newProps: BatchActionlist['props'], lastState: BatchActionlist['state']) {
    if (
      newProps.currentContent &&
      newProps.currentContent.Id &&
      lastState.currentId !== newProps.currentContent.Id &&
      lastState.actions.length === 0
    ) {
      newProps.getActions(newProps.currentContent.Id, 'DMSBatchActions')
    }
    const optionList: ActionModel[] = []
    if (lastState.actions.length !== newProps.actions.length) {
      newProps.actions.forEach((action, index) => {
        if (index > 1) {
          optionList.push(action)
        }
      })
    }
    return {
      ...lastState,
      currentId: (newProps.currentContent && newProps.currentContent.Id) || null,
      options: optionList,
    }
  }
  public isHidden = () => {
    return this.props.selected.length > 0 ? false : true
  }
  public handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const { currentContent } = this.props
    const { options } = this.state
    this.props.closeActionMenu()
    currentContent &&
      this.props.openActionMenu(options, currentContent, currentContent.Id.toString(), e.currentTarget, {
        top: (e.target as HTMLElement).offsetTop + 100,
        left: (e.target as HTMLElement).offsetLeft + 100,
      })
  }

  public handleClickMobile = (e: React.MouseEvent<HTMLElement>) => {
    const { actions, currentContent } = this.props
    this.props.closeActionMenu()
    currentContent &&
      this.props.openActionMenu(actions, currentContent, currentContent.Id.toString(), e.currentTarget, {
        top: (e.target as HTMLElement).offsetTop + 100,
        left: (e.target as HTMLElement).offsetLeft + 100,
      })
  }

  public handleClose = () => {
    this.setState({ anchorEl: null })
  }
  public handleMenuItemClick = (actionName: string) => {
    switch (actionName) {
      case 'DeleteBatch':
      case 'Delete':
        this.props.openDialog(
          <DeleteDialog content={this.props.selected} />,
          resources.DELETE,
          this.props.clearSelection,
        )
        this.handleClose()
        break
      case 'MoveBatch':
        this.handleClose()
        this.props.openPicker(
          <PathPickerDialog
            mode="Move"
            dialogComponent={<MoveToConfirmDialog />}
            dialogTitle={resources.MOVE}
            dialogCallback={Actions.moveBatch as any}
            currentPath={this.props.currentParent ? this.props.currentParent.Path : ''}
          />,
          'move',
          () => this.props.closePicker() && this.props.deselectPickeritem(),
        )
        break
      case 'CopyBatch':
        this.handleClose()
        this.props.openPicker(
          <PathPickerDialog
            mode="Copy"
            dialogComponent={<CopyToConfirmDialog />}
            dialogTitle={resources.COPY}
            dialogCallback={Actions.copyBatch as any}
            currentPath={this.props.currentParent ? this.props.currentParent.Path : ''}
          />,
          'copy',
          () => this.props.closePicker() && this.props.deselectPickeritem(),
        )
        break
      default:
        console.log(`${actionName} is clicked`)
    }
  }
  public render() {
    const { actions } = this.props
    if (!this.props.currentContent) {
      return null
    }
    return (
      <MediaQuery minDeviceWidth={700}>
        {matches => {
          return matches ? (
            <ul style={this.isHidden() ? { display: 'none', margin: 0 } : { display: 'block', margin: 0 }}>
              {actions.map((action, index) => {
                return index < 2 ? (
                  <li key={action.Name} style={styles.icon} aria-label={action.DisplayName} title={action.DisplayName}>
                    <IconButton
                      aria-label={action.DisplayName}
                      disableRipple={true}
                      onClick={() => this.handleMenuItemClick(action.Name)}>
                      <Icon
                        type={iconType.materialui}
                        color="primary"
                        style={styles.icon}
                        iconName={icons[action.Icon.toLowerCase()]}
                      />
                    </IconButton>
                  </li>
                ) : null
              })}
              <li key="More" style={styles.icon}>
                <IconButton
                  aria-label="More"
                  aria-owns="actionmenu"
                  aria-haspopup="true"
                  onClick={e => this.handleClick(e)}
                  style={{ position: 'relative' }}>
                  <Icon color="primary" type={iconType.materialui} iconName="more_vert" />
                </IconButton>
              </li>
            </ul>
          ) : (
            <IconButton
              aria-label="Actions"
              aria-owns={'batch-actions'}
              aria-haspopup="true"
              onClick={e => this.handleClickMobile(e)}
              style={{ height: 36 }}>
              <Icon style={styles.menuIcon} type={iconType.materialui} iconName="more_vert" />
            </IconButton>
          )
        }}
      </MediaQuery>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BatchActionlist)
