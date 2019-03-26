import Button from '@material-ui/core/Button'
import { Group, User } from '@sensenet/default-content-types'
import React, { Component } from 'react'
import { resources } from '../../../assets/resources'

const styles = {
  buttonContainer: {
    padding: 10,
    textAlign: 'right',
  },
}

interface UserButtonRowProps {
  cancelClick: (open: boolean) => void
  submitClick: (users?: number[] | null, groups?: Group[]) => void
  users: User[]
  groups: Group[]
}

export class UserButtonRow extends Component<UserButtonRowProps> {
  public handleCancelClick = () => {
    this.props.cancelClick(false)
  }
  public handleSubmitClick = () => {
    const users = this.props.users.map(user => user.Id)
    this.props.submitClick(users, this.props.groups)
    this.props.cancelClick(false)
  }
  public render() {
    return (
      <div style={styles.buttonContainer as any}>
        <Button color="default" style={{ marginRight: 20, color: '#fff' }} onClick={() => this.handleCancelClick()}>
          {resources.CANCEL}
        </Button>
        <Button onClick={() => this.handleSubmitClick()} variant="contained" color="secondary">
          {resources.ADD}
        </Button>
      </div>
    )
  }
}
