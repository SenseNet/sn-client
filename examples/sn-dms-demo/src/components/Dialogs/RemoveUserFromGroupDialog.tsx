import Button from '@material-ui/core/Button'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import { GenericContent, Group, User } from '@sensenet/default-content-types'
import { Actions } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import * as DMSActions from '../../Actions'
import { resources } from '../../assets/resources'
import { rootStateType } from '../../store/rootReducer'
import { removeMemberFromGroups } from '../../store/usersandgroups/actions'

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
  longList: {
    maxHeight: 300,
    overflowY: 'auto',
    padding: 5,
  },
  normalList: {},
}

interface RemoveUserFromGroupDialogProps {
  permanent?: boolean
  user: GenericContent | null
  groups: Group[]
}

interface RemoveUserFromGroupDialogState {
  checked: boolean
}

const mapStateToProps = (state: rootStateType) => {
  return {
    selected: state.dms.usersAndGroups.user.selected,
    closeCallback: state.dms.dialog.onClose,
  }
}

const mapDispatchToProps = {
  closeDialog: DMSActions.closeDialog,
  deleteContent: Actions.deleteBatch,
  removeMemberFromGroups,
}

class RemoveUserFromGroupDialog extends React.Component<
  { classes: any } & RemoveUserFromGroupDialogProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  RemoveUserFromGroupDialogState
> {
  public state = {
    checked: this.props.permanent === null || !this.props.permanent ? false : true,
  }
  constructor(props: RemoveUserFromGroupDialog['props']) {
    super(props)
    this.submitCallback = this.submitCallback.bind(this)
  }
  public handleCheckboxClick = () => {
    this.setState({
      checked: !this.state.checked,
    })
  }
  public handleCancel = () => {
    this.props.closeDialog()
    this.props.closeCallback()
  }
  public submitCallback = () => {
    const { user, groups } = this.props
    this.props.removeMemberFromGroups([user ? user.Id : 0], groups)
    this.props.closeDialog()
  }
  public render() {
    const { selected } = this.props
    return (
      <MediaQuery minDeviceWidth={700}>
        {matches => (
          <div>
            <Typography variant="h5" gutterBottom={true}>
              {resources.DELETE}
            </Typography>
            <div style={styles.inner}>
              <div style={{ opacity: 0.54 }}>{resources.ARE_YOU_SURE_YOU_WANT_TO_REMOVE_USER}</div>
              <div style={selected.length > 3 ? styles.longList : styles.normalList}>
                <ul style={styles.list}>
                  {selected.map((user: User) => (
                    <li key={user.Id} style={styles.listItem}>
                      {// tslint:disable-next-line:no-string-literal
                      user['FullName'] || user['DisplayName']}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ opacity: 0.54 }}>{resources.FROM_GROUP}</div>
              <ul style={styles.list}>
                {this.props.groups
                  ? this.props.groups.map(group => (
                      <li key={group.Id} style={styles.listItem}>
                        {
                          // tslint:disable-next-line:no-string-literal
                          group.DisplayName
                        }
                      </li>
                    ))
                  : null}
              </ul>
            </div>
            <div style={styles.buttonContainer}>
              <div style={styles.rightColumn as any}>
                {matches ? (
                  <Button color="default" style={{ marginRight: 20 }} onClick={() => this.handleCancel()}>
                    {resources.CANCEL}
                  </Button>
                ) : null}
                <Button
                  onClick={() => this.submitCallback()}
                  variant="contained"
                  color="secondary"
                  style={styles.deleteButton}>
                  {resources.REMOVE}
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
)(withStyles(styles as any)(RemoveUserFromGroupDialog))
