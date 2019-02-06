import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'

import Button from '@material-ui/core/Button'
import Fade from '@material-ui/core/Fade'
import TextField from '@material-ui/core/TextField'
import { Actions } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import * as DMSActions from '../../Actions'
import { resources } from '../../assets/resources'
import { rootStateType } from '../../store/rootReducer'

const styles = {
  buttonContainer: {
    display: 'flex',
    height: 32,
  },
  buttonContainerMobile: {
    display: 'flex',
    height: 32,
    boxShadow: '0px -5px 10px 0px rgba(204,204,204,1)',
    margin: '0 -24px -10px',
    padding: '10px 10px 5px',
    color: '#016D9E',
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
  buttonsMobile: {
    flexGrow: 1,
    marginLeft: 'auto',
    display: 'flex',
  },
}

interface ApproveorRejectDialogProps {
  id: number
  fileName: string | undefined
}

interface ApproveorRejectDialogState {
  isRejected: boolean
  rejectReason: string
}

const mapStateToProps = (state: rootStateType) => {
  return {
    closeCallback: state.dms.dialog.onClose,
  }
}

const mapDispatchToProps = {
  closeDialog: DMSActions.closeDialog,
  approveContent: Actions.approve,
  rejectContent: Actions.rejectContent,
}

class RestoreVersionDialog extends React.Component<
  { classes: any } & ApproveorRejectDialogProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  ApproveorRejectDialogState
> {
  public state: ApproveorRejectDialogState = {
    isRejected: false,
    rejectReason: '',
  }
  public handleCancel = () => {
    this.props.closeDialog()
  }
  public approveCallback = () => {
    const { closeDialog, id, approveContent } = this.props
    closeDialog()
    approveContent(id)
  }
  public rejectCallback = () => {
    const { closeDialog, id, rejectContent } = this.props
    const { isRejected, rejectReason } = this.state
    isRejected
      ? closeDialog() && rejectContent(id, rejectReason)
      : this.setState({
          isRejected: true,
        })
  }
  public handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      // tslint:disable-next-line:no-string-literal
      rejectReason: (e.target as HTMLInputElement).value,
    })
  }
  public render() {
    const { fileName } = this.props
    const { isRejected } = this.state
    return (
      <MediaQuery minDeviceWidth={700}>
        {matches => (
          <div>
            <Typography variant="h5" gutterBottom={true}>
              {resources.APPROVE_OR_REJECT}
            </Typography>
            <div style={matches ? styles.inner : styles.innerMobile}>
              <div>
                {resources.YOU_ARE_ABOUT_TO_APPROVE_OR_REJECT}
                <strong style={{ fontFamily: 'Raleway Semibold' }}> {fileName}</strong>?
              </div>
            </div>
            <Fade in={isRejected}>
              <TextField
                label={resources.REJECT_REASON_PLACEHOLDER}
                multiline={true}
                rowsMax="4"
                value={this.state.rejectReason}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleChange(e)}
                margin="normal"
                fullWidth={true}
                style={{ marginBottom: 30, marginTop: 0 }}
              />
            </Fade>
            <div style={matches ? styles.buttonContainer : styles.buttonContainerMobile}>
              <div style={matches ? (styles.rightColumn as any) : styles.buttonsMobile}>
                {matches ? (
                  <Button color="default" style={{ marginRight: 20 }} onClick={() => this.handleCancel()}>
                    {resources.CANCEL}
                  </Button>
                ) : null}
                <Button
                  onClick={() => this.approveCallback()}
                  variant="contained"
                  color="secondary"
                  style={matches ? { marginRight: 20 } : { marginRight: 20, flexGrow: 1 }}>
                  {resources.APPROVE}
                </Button>
                <Button
                  onClick={() => this.rejectCallback()}
                  variant="contained"
                  color="primary"
                  style={matches ? {} : { flexGrow: 1 }}>
                  {resources.REJECT}
                </Button>
              </div>
            </div>
          </div>
        )}
      </MediaQuery>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles as any)(RestoreVersionDialog))
