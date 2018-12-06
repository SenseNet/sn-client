import TableCell from '@material-ui/core/TableCell'
import Tooltip from '@material-ui/core/Tooltip'
import { GenericContent, User } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import * as React from 'react'
import { connect } from 'react-redux'
import { resources } from '../../../assets/resources'
import { rootStateType } from '../../../store/rootReducer'

const styles = {
  cell: {
    width: 100,
  },
  lockedCellContainer: {
    textAlign: 'center',
  },
  userName: {
    fontFamily: 'Raleway Semibold',
    fontStyle: 'italic',
    fontSize: 11,
    display: 'block',
  },
  icon: {
    display: 'block',
    fontSize: 20,
  },
}

export enum DocumentState {
  Default = 0,
  CheckedOut = 1,
  Approvable = 2,
}

const mapStateToProps = (state: rootStateType) => {
  return {
    currentUserName: state.sensenet.session.user.userName,
  }
}

export interface LockedCellProps {
  content: GenericContent | null
  fieldName: string
}

export interface LockedCellState {
  status: DocumentState
}

class LockedCell extends React.Component<LockedCellProps & ReturnType<typeof mapStateToProps>, LockedCellState> {
  public getStatus = (content: GenericContent | null) => {
    if (content ? content.Approvable : false) {
      return DocumentState.Approvable
    } else if (content ? content.CheckedOutTo : null) {
      return DocumentState.CheckedOut
    } else {
      return DocumentState.Default
    }
  }
  public state = {
    status: this.getStatus(this.props.content),
  }
  public lockedByName = (content: GenericContent | null) => {
    // tslint:disable-next-line:no-string-literal
    const checkedOutTo = content ? content['CheckedOutTo'] : null
    // tslint:disable-next-line:no-string-literal
    if (checkedOutTo ? (checkedOutTo as User).Name === this.props.currentUserName : false) {
      return 'Me'
    } else {
      // tslint:disable-next-line:no-string-literal
      return (checkedOutTo as User).FullName
    }
  }
  public render() {
    const { content } = this.props
    // tslint:disable-next-line:no-string-literal
    const checkedOutBy = content ? (content['CheckedOutTo'] ? this.lockedByName(content) : null) : null
    return (
      <TableCell padding="checkbox" style={styles.cell}>
        {content ? (
          content.Locked ? (
            this.state.status === DocumentState.CheckedOut ? (
              <Tooltip title={`${resources.CHECKED_OUT_BY}${checkedOutBy}`}>
                <div style={styles.lockedCellContainer as any}>
                  <span style={styles.userName}>{checkedOutBy}</span>
                  <span style={styles.icon}>
                    <Icon style={{ fontSize: 20 }} iconName="lock" type={iconType.materialui} />
                  </span>
                </div>
              </Tooltip>
            ) : null
          ) : this.state.status === DocumentState.Approvable ? (
            <Tooltip title={resources.APPROVABLE}>
              <div style={styles.lockedCellContainer as any}>
                <span style={styles.icon}>
                  <Icon style={{ fontSize: 20 }} iconName="access_time" type={iconType.materialui} />
                </span>
              </div>
            </Tooltip>
          ) : null
        ) : null}
      </TableCell>
    )
  }
}

export default connect(
  mapStateToProps,
  {},
)(LockedCell)
