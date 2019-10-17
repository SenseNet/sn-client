import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import { MuiThemeProvider } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { Icon, iconType } from '@sensenet/icons-react'
import React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { pickerTheme } from '../../assets/picker'
import { resources } from '../../assets/resources'
import { rootStateType } from '../../store/rootReducer'

const mapStateToProps = (state: rootStateType) => {
  return {
    open: state.dms.picker.isOpened,
    onClose: state.dms.picker.pickerOnClose,
    pickerContent: state.dms.picker.content,
    pickerMode: state.dms.picker.mode,
  }
}

const styles = {
  closeButton: {
    position: 'absolute',
    right: 0,
  },
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

class Picker extends React.Component<ReturnType<typeof mapStateToProps>, {}> {
  public handleClose = () => {
    this.props.onClose()
  }

  public render() {
    const { open } = this.props
    return (
      <MediaQuery minDeviceWidth={700}>
        {matches => (
          <MuiThemeProvider theme={pickerTheme}>
            {matches ? (
              <Dialog open={open} onClose={this.handleClose}>
                <DialogTitle disableTypography={true}>
                  <Toolbar>
                    <Typography variant="h6" color="inherit">
                      {resources[this.props.pickerMode.toUpperCase()]}
                    </Typography>
                    <IconButton
                      style={styles.closeButton as React.CSSProperties}
                      color="inherit"
                      onClick={() => this.handleClose()}>
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
                    <Typography variant="h6" color="inherit" style={styles.mobileContentTitle}>
                      {resources[this.props.pickerMode.toUpperCase()]}
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

export default connect(mapStateToProps)(Picker)
