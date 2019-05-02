import Button from '@material-ui/core/Button'
import TableCell from '@material-ui/core/TableCell'
import { Group, User } from '@sensenet/default-content-types'
import { Icon } from '@sensenet/icons-react'
import React from 'react'
import { connect } from 'react-redux'
import * as DMSActions from '../../Actions'
import { resources } from '../../assets/resources'
import RemoveUserFromGroupDialog from '../Dialogs/RemoveUserFromGroupDialog'

const styles = {
  cell: {
    width: 225,
  },
  button: {
    fontFamily: 'Raleway Medium',
    fontSize: 15,
  },
}

// tslint:disable-next-line:no-empty-interface
interface DeleteUserFromGroupProps {
  user: User | null
  group: Group
}

// tslint:disable-next-line:no-empty-interface
interface DeleteUserFromGroupState {}

const mapStateToProps = () => {
  return {}
}

const mapDispatchToProps = {
  openDialog: DMSActions.openDialog,
  closeDialog: DMSActions.closeDialog,
}

class DeleteUserFromGroup extends React.Component<
  DeleteUserFromGroupProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  DeleteUserFromGroupState
> {
  public handleClick = () => {
    this.props.openDialog(
      <RemoveUserFromGroupDialog user={this.props.user} groups={[this.props.group]} />,
      resources.DELETE,
      this.props.closeDialog,
    )
  }
  public render() {
    return (
      <TableCell padding="checkbox" style={styles.cell as any}>
        <Button style={styles.button} onClick={() => this.handleClick()}>
          <Icon iconName="delete" style={{ fontSize: 19, marginRight: 10 }} />
          {resources.DELETE_FROM_GROUP}
        </Button>
      </TableCell>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DeleteUserFromGroup)
