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

interface GroupButtonRowProps {
  cancelClick: (open: boolean) => void
  submitClick: (user?: User | null, groups?: Group[]) => void
  user: User | null
  groups: Group[]
}

export class GroupButtonRow extends Component<GroupButtonRowProps> {
  public handleCancelClick = () => {
    this.props.cancelClick(false)
  }
  public handleSubmitClick = () => {
    this.props.submitClick(this.props.user, this.props.groups)
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
