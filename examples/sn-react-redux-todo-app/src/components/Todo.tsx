import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import CreateIcon from '@material-ui/icons/Create'
import DeleteIcon from '@material-ui/icons/Delete'
import { Status, Task } from '@sensenet/default-content-types'
import * as React from 'react'

import { Link } from 'react-router-dom'

interface TodoProps {
  content: Task
  onClick: (todo: Task) => void
  onDeleteClick: (todo: Task) => void
}

export class Todo extends React.Component<TodoProps, { comp }> {
  constructor(props) {
    super(props)
    this.state = {
      comp: this.props.content.Status && this.props.content.Status[0] === 'completed' ? true : false,
    }
    this.handleClick = this.handleClick.bind(this)
  }
  public handleClick() {
    const selected = this.state.comp ? false : true
    this.props.content.Status = selected ? Status.completed : Status.active
    this.setState({
      comp: selected,
    })
  }
  public render() {
    const link = `/edit/` + this.props.content.Id
    const { content } = this.props
    return (
      <Grid container={true}>
        <Grid item={true} sm={12} md={8} lg={8} style={{ paddingTop: 7 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.comp}
                onClick={() => {
                  this.handleClick()
                  this.props.onClick(content)
                }}
                value="comp"
              />
            }
            label={content.DisplayName}
          />
        </Grid>
        <Grid item={true} sm={12} md={4} lg={4} style={{ textAlign: 'center' }}>
          <Link to={link}>
            <IconButton aria-label="Edit">
              <CreateIcon />
            </IconButton>
          </Link>
          <IconButton aria-label="Delete" onClick={() => this.props.onDeleteClick(content)}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    )
  }
}
