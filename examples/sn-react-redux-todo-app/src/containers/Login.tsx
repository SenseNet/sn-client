import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { reactControlMapper } from '@sensenet/controls-react'
import { Actions } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import { rootStateType } from '..'

const styles = {
  button: {
    marginTop: '20px',
    color: '#fff',
  },
  container: {
    maxWidth: 500,
    margin: '0 auto',
    textAlign: 'center',
  },
  buttonRow: {
    textAlign: 'right',
    width: '100%',
  },
}

const mapStateToProps = (state: rootStateType) => {
  return {
    loginState: state.sensenet.session.loginState,
    currentUserId: state.sensenet.session.user.content.Id,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    user: reactControlMapper(ownProps.props.repository).getFullSchemaForContentType('User', 'new'),
    onSubmit: (name, password) => dispatch(Actions.userLogin(name, password)),
  }
}
export interface LoginProps {
  repository: any
}

export class Login extends React.Component<ReturnType<typeof mapDispatchToProps>, {}> {
  constructor(props) {
    super(props)
  }
  public render() {
    const { user } = this.props
    user.fieldMappings = user.fieldMappings.filter(
      fieldSettings =>
        fieldSettings.fieldSettings.Name === 'LoginName' || fieldSettings.fieldSettings.Name === 'Password',
    )
    return (
      <div style={styles.container as any}>
        <form
          onSubmit={e => {
            e.preventDefault()
            // tslint:disable-next-line:no-string-literal
            const name = document.getElementById('LoginName')['value']
            // tslint:disable-next-line:no-string-literal
            const password = document.getElementById('Password')['value']
            this.props.onSubmit(name, password)
          }}>
          <Grid container={true}>
            {user.fieldMappings.map((_e, i) => (
              <Grid item={true} sm={12} md={12} lg={12} key={i}>
                {React.createElement(user.fieldMappings[i].controlType, {
                  ...user.fieldMappings[i].clientSettings,
                  'data-actionName': 'new',
                  'data-fieldValue': '',
                  className: user.fieldMappings[i].clientSettings.key,
                } as any)}
              </Grid>
            ))}
            <Grid item={true} style={styles.buttonRow as any}>
              <Button type="submit" style={styles.button} variant="raised" color="primary">
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    )
  }
}

const loginView = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login)

export default loginView
