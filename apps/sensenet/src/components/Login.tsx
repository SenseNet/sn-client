import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Check from '@material-ui/icons/Check'
import React from 'react'
import { connect } from 'react-redux'
import { rootStateType } from '../store'
import { setPersistedState } from '../store/PersistedState'
import { loginToRepository } from '../store/Session'

const mapStateToProps = (state: rootStateType) => ({
  lastUserName: state.persistedState.lastUserName,
  lastRepository: state.persistedState.lastRepositoryUrl,
})

const mapDispatchToProps = {
  loginToRepository,
  setPersistedState,
}

export interface LoginState {
  userName: string
  password: string
  repositoryUrl: string
}

class Login extends React.Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, LoginState> {
  public state: LoginState = {
    repositoryUrl: this.props.lastRepository,
    userName: this.props.lastUserName,
    password: '',
  }

  constructor(props: Login['props']) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  private handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    this.props.setPersistedState({
      lastRepositoryUrl: this.state.repositoryUrl,
      lastUserName: this.state.userName,
    })
    this.props.loginToRepository(this.state.userName, this.state.password, this.state.repositoryUrl)
  }

  public render() {
    return (
      <Paper style={{ padding: '1em', flexShrink: 0, width: '450px', alignSelf: 'center', margin: 'auto' }}>
        <Typography variant="h4">Login</Typography>
        <form onSubmit={this.handleSubmit}>
          <Divider />
          <TextField
            required={true}
            margin="normal"
            label="Username"
            helperText="Enter the user name you've registered with"
            fullWidth={true}
            defaultValue={this.props.lastUserName}
            onChange={ev => {
              this.setState({
                userName: ev.target.value,
              })
            }}
          />
          <TextField
            required={true}
            margin="dense"
            label="Password"
            fullWidth={true}
            type="password"
            helperText="Enter a matching password for the user"
            onChange={ev => {
              this.setState({
                password: ev.target.value,
              })
            }}
          />
          <TextField
            margin="dense"
            label="Repository URL"
            fullWidth={true}
            defaultValue={this.props.lastRepository}
            onChange={ev => {
              this.setState({
                repositoryUrl: ev.target.value,
              })
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1em' }}>
            <IconButton type="submit">
              <Check />
              <Typography variant="button">Log in</Typography>
            </IconButton>
          </div>
        </form>
      </Paper>
    )
  }
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login)

export default connectedComponent
