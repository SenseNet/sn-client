import Avatar from '@material-ui/core/Avatar'
import Paper from '@material-ui/core/Paper'
import { Icon } from '@sensenet/icons-react'
import React from 'react'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import * as DMSActions from '../../Actions'
import { rootStateType } from '../../store/rootReducer'
import EditPropertiesDialog from '../Dialogs/EditPropertiesDialog'
import { resources } from '../../assets/resources'
import defaultAvatar from '../../assets/no-avatar.jpg'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    padding: 12,
    margin: '10px 0 0',
    boxShadow: 'none',
  },
  leftColumn: {
    flex: '0 0 0%',
  },
  rightColumn: {
    flex: '1 1 0%',
    paddingLeft: 10,
  },
  avatar: {
    width: 70,
    height: 70,
  },
  fullName: {
    color: '#666666',
    fontFamily: 'Raleway SemiBold',
    fontSize: 21,
    flexDirection: 'column',
  },
  editIcon: {
    cursor: 'pointer',
    fontSize: 18,
    flexDirection: 'column',
    marginLeft: 5,
    marginTop: 5,
  },
  email: {
    color: '#016D9E',
    textDecoration: 'none',
    fontFamily: 'Raleway SemiBold',
    fontSize: 16,
    marginTop: 5,
    display: 'block',
  },
  phone: {
    color: '#666666',
    fontFamily: 'Raleway SemiBold',
    fontSize: 16,
    textDecoration: 'none',
    marginTop: 5,
    display: 'block',
  },
}

const mapStateToProps = (state: rootStateType) => {
  return {
    user: state.dms.usersAndGroups.user.currentUser,
    isLoading: state.dms.usersAndGroups.user.isLoading,
    repositoryUrl: state.sensenet.session.repository ? state.sensenet.session.repository.repositoryUrl : '',
    currentUser: state.sensenet.session.user.userName,
  }
}

const mapDispatchToProps = {
  openDialog: DMSActions.openDialog,
  closeDialog: DMSActions.closeDialog,
}

class UserInfo extends React.Component<{} & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, {}> {
  public handleEditClick = () => {
    this.props.user &&
      this.props.openDialog(
        <EditPropertiesDialog content={this.props.user} contentTypeName="User" />,
        resources.EDIT_PROPERTIES,
        this.props.closeDialog,
      )
  }
  public render() {
    const { isLoading, repositoryUrl, user, currentUser } = this.props
    const avatarUrl = (user && user.Avatar && user.Avatar.Url && repositoryUrl + user.Avatar.Url) || defaultAvatar
    return isLoading ? null : (
      <Paper style={styles.container as any}>
        <div style={styles.leftColumn}>
          <Avatar alt={user ? user.FullName : ''} src={avatarUrl} style={styles.avatar} />
        </div>
        <div style={styles.rightColumn}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Typography style={styles.fullName as any}>{user ? user.FullName : ''}</Typography>
            {user && user.Name === currentUser ? (
              <Icon iconName="edit" onClick={() => this.handleEditClick()} style={styles.editIcon} />
            ) : null}
          </div>
          <a href={`mailto:${user ? user.Email : ''}`} style={styles.email}>
            {user ? user.Email : ''}
          </a>
          <Typography>
            <a href={`tel:${user ? user.Phone : ''}`} style={styles.phone}>
              {user ? user.Phone : ''}
            </a>
          </Typography>
        </div>
      </Paper>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo)
