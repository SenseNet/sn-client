import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { Icon, iconType } from '@sensenet/icons-react'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { pickerTheme } from '../../assets/picker'
import { resources } from '../../assets/resources'
import {
  deselectPickeritem,
  loadPickerItems,
  loadPickerParent,
  selectPickerItem,
  setBackLink,
  setPickerParent,
} from '../../store/picker/actions'
import { rootStateType } from '../../store/rootReducer'

// tslint:disable-next-line:no-var-requires
const sensenetLogo = require('../../assets/sensenet_white.png')

const mapStateToProps = (state: rootStateType) => {
  return {
    open: state.dms.picker.isOpened,
    anchorElement: state.dms.actionmenu.anchorElement,
    onClose: state.dms.picker.pickerOnClose,
    parent: state.dms.picker.parent,
    items: state.dms.picker.items,
    selected: state.dms.documentLibrary.selected,
    closestWs: state.dms.picker.closestWorkspace,
    backLink: state.dms.picker.backLink,
    pickerContent: state.dms.picker.content,
    pickerMode: state.dms.picker.mode,
  }
}

const mapDispatchToProps = {
  selectPickerItem,
  deselectPickeritem,
  loadPickerParent,
  loadPickerItems,
  setPickerParent,
  setBackLink,
}

const styles = {
  snButton: {
    flex: '0 0 auto',
    width: 48,
    height: 48,
    display: 'inline-flex',
    alignItems: 'center',
    verticalAlign: 'middle',
    justifyContent: 'center',
  },
  snLogo: {
    width: '1em',
    height: '1em',
    display: 'inline-block',
    flexShrink: 0,
  },
  mobileToolbar: {
    background: '#fff',
    color: '#000',
  },
  mobilePickerHeader: {
    display: 'flex',
  },
  mobilePickerTitle: {
    flexGrow: 1,
    padding: '8px 16px',
    fontFamily: 'Raleway SemiBold',
  },
  mobilePickerClose: {
    fontFamily: 'Raleway Medium',
    fontSize: 14,
    color: '#016D9E',
  },
  mobileContentTitle: {
    fontSize: 16,
  },
}

class Picker extends React.Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, {}> {
  constructor(props: Picker['props']) {
    super(props)
  }
  public handleClose = () => {
    this.props.onClose()
    this.props.setBackLink(true)
  }
  public isLastItem = () => {
    const { parent, closestWs } = this.props
    return parent && closestWs ? parent.Path === closestWs.Path : false
  }
  public handleClickBack = () => {
    const { parent } = this.props
    if (this.isLastItem()) {
      this.props.setBackLink(false)
      const snContent = {
        DisplayName: 'sensenet',
        Workspace: {
          Path: null,
        },
      } as any
      this.props.setPickerParent(snContent)
      this.props.loadPickerItems('/', {
        query: 'TypeIs:Workspace -TypeIs:Site',
        select: ['DisplayName', 'Id', 'Path', 'Children'],
        orderby: [['DisplayName', 'asc']],
      })
      this.props.deselectPickeritem()
    } else {
      this.props.loadPickerParent(parent && parent.ParentId ? parent.ParentId : '')
      this.props.loadPickerItems(parent ? parent.Path.substr(0, parent.Path.length - (parent.Name.length + 1)) : '')
      this.props.deselectPickeritem()
    }
  }
  public render() {
    const { backLink, open, parent } = this.props
    return (
      <MediaQuery minDeviceWidth={700}>
        {matches => (
          <MuiThemeProvider theme={pickerTheme}>
            {matches ? (
              <Dialog open={open} onClose={this.handleClose}>
                <DialogTitle>
                  <Toolbar>
                    {backLink ? (
                      <IconButton color="inherit" onClick={() => this.handleClickBack()}>
                        <Icon type={iconType.materialui} iconName="arrow_back" style={{ color: '#fff' }} />
                      </IconButton>
                    ) : (
                      <div style={styles.snButton}>
                        <img src={sensenetLogo} alt="sensenet" aria-label="sensenet" style={styles.snLogo} />
                      </div>
                    )}
                    <Typography variant="title" color="inherit">
                      {parent ? parent.DisplayName : 'Move content'}
                    </Typography>
                    <IconButton color="inherit" onClick={() => this.handleClose()}>
                      <Icon type={iconType.materialui} iconName="close" style={{ color: '#fff' }} />
                    </IconButton>
                  </Toolbar>
                </DialogTitle>
                {this.props.pickerContent}
              </Dialog>
            ) : (
              <Drawer anchor="bottom" open={open} onClose={this.handleClose}>
                <DialogTitle>
                  <Toolbar style={{ ...styles.mobileToolbar, ...styles.mobilePickerHeader }}>
                    <Typography style={styles.mobilePickerTitle}>
                      {resources[`${this.props.pickerMode.toUpperCase()}_HERE`]}
                    </Typography>
                    <Button color="inherit" onClick={() => this.handleClose()} style={styles.mobilePickerClose}>
                      {resources.CANCEL}
                    </Button>
                  </Toolbar>
                  <Toolbar style={styles.mobileToolbar}>
                    {backLink ? (
                      <IconButton color="inherit" onClick={() => this.handleClickBack()}>
                        <Icon type={iconType.materialui} iconName="arrow_back" />
                      </IconButton>
                    ) : (
                      <div style={styles.snButton}>
                        <img src={sensenetLogo} alt="sensenet" aria-label="sensenet" style={styles.snLogo} />
                      </div>
                    )}
                    <Typography variant="title" color="inherit" style={styles.mobileContentTitle}>
                      {parent ? parent.DisplayName : 'Move content'}
                    </Typography>
                  </Toolbar>
                </DialogTitle>
                {this.props.pickerContent}
              </Drawer>
            )}
          </MuiThemeProvider>
        )}
      </MediaQuery>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Picker)
