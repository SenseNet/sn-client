import Button from '@material-ui/core/Button'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import { Actions } from '@sensenet/redux'
import React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import * as DMSActions from '../../Actions'
import { versionName } from '../../assets/helpers'
import { resources } from '../../assets/resources'
import { rootStateType } from '../../store/rootReducer'

const styles = {
  buttonContainer: {
    display: 'flex',
    height: 32,
  },
  containerChild: {
    flexGrow: 1,
    display: 'inline-flex',
    opacity: 0.54,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: '6px 10px',
  },
  inner: {
    minWidth: 550,
    fontFamily: 'Raleway Medium',
    fontSize: 14,
    margin: '20px 0',
  },
  innerMobile: {
    fontFamily: 'Raleway Medium',
    fontSize: 14,
    margin: '20px 0',
  },
  rightColumn: {
    textAlign: 'right',
    flexGrow: 1,
    marginLeft: 'auto',
  },
  listItem: {
    listStyleType: 'none',
    lineHeight: '25px',
  },
  list: {
    margin: '10px 0 0',
    padding: 0,
  },
  label: {
    fontSize: 14,
  },
}

interface RestoreVersionDialogProps {
  id: number
  version: string
  fileName: string
}

const mapStateToProps = (state: rootStateType) => {
  return {
    currentitems: state.sensenet.currentitems.entities,
    closeCallback: state.dms.dialog.onClose,
  }
}

const mapDispatchToProps = {
  closeDialog: DMSActions.closeDialog,
  restoreVersion: Actions.restoreVersion,
}

class RestoreVersionDialog extends React.Component<
  { classes: any } & RestoreVersionDialogProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  {}
> {
  public handleCancel = () => {
    this.props.closeDialog()
  }
  public submitCallback = (id: number, version: string) => {
    this.props.restoreVersion(id, version)
    this.props.closeDialog()
  }
  public formatVersionNumber = (version: string) => {
    const v = resources[`VERSION_${versionName(version.slice(-1))}`]
    return `${version.substring(0, version.length - 2)} ${v}`
  }
  public render() {
    const { id, fileName, version } = this.props
    return (
      <MediaQuery minDeviceWidth={700}>
        {matches => (
          <div>
            <Typography variant="h5" gutterBottom={true}>
              {resources.RESTORE_VERSION}
            </Typography>
            <div style={matches ? styles.inner : styles.innerMobile}>
              <div>
                {resources.ARE_YOU_SURE_YOU_WANT_TO_RESTORE}
                <strong style={{ fontFamily: 'Raleway Semibold' }}>{this.formatVersionNumber(version)}</strong> of
                <strong style={{ fontFamily: 'Raleway Semibold' }}> {fileName}</strong>?
              </div>
            </div>
            <div style={styles.buttonContainer}>
              <div style={styles.rightColumn as any}>
                {matches ? (
                  <Button color="default" style={{ marginRight: 20 }} onClick={() => this.handleCancel()}>
                    {resources.CANCEL}
                  </Button>
                ) : null}
                <Button onClick={() => this.submitCallback(id, version)} variant="contained" color="secondary">
                  {resources.RESTORE}
                </Button>
              </div>
            </div>
          </div>
        )}
      </MediaQuery>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles as any)(RestoreVersionDialog))
