import Avatar from '@material-ui/core/Avatar'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import GroupIcon from '@material-ui/icons/Group'
import { Group } from '@sensenet/default-content-types'
import { Icon } from '@sensenet/icons-react'
import * as React from 'react'
import { connect } from 'react-redux'
import * as DMSActions from '../../../Actions'
import { resources } from '../../../assets/resources'
import { rootStateType } from '../../../store/rootReducer'
import EditPropertiesDialog from '../../Dialogs/EditPropertiesDialog'

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

interface GroupInfoProps {
  isAdmin: boolean
  group: Group | null
}

const mapStateToProps = (state: rootStateType) => {
  return {
    isLoading: state.dms.usersAndGroups.user.isLoading,
  }
}

const mapDispatchToProps = {
  openDialog: DMSActions.openDialog,
  closeDialog: DMSActions.closeDialog,
}

class GroupInfo extends React.Component<
  GroupInfoProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  {}
> {
  public handleEditClick = () => {
    this.props.group &&
      this.props.openDialog(
        <EditPropertiesDialog content={this.props.group} contentTypeName="Group" />,
        resources.EDIT_PROPERTIES,
        this.props.closeDialog,
      )
  }
  public render() {
    const { isLoading, group, isAdmin } = this.props
    return isLoading ? null : (
      <Paper style={styles.container as any}>
        <div style={styles.leftColumn}>
          <Avatar style={styles.avatar}>
            <GroupIcon style={{ fontSize: 40 }} />
          </Avatar>
        </div>
        <div style={styles.rightColumn}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Typography style={styles.fullName as any}>{group ? group.DisplayName : ''}</Typography>
            {isAdmin ? <Icon iconName="edit" onClick={() => this.handleEditClick()} style={styles.editIcon} /> : null}
          </div>
          {/* <a href={`mailto:${user ? user.Email : ''}`} style={styles.email}>
            {user ? user.Email : ''}
          </a> */}
          <Typography>{group ? <div dangerouslySetInnerHTML={{ __html: group.Description || '' }} /> : ''}</Typography>
        </div>
      </Paper>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupInfo)
