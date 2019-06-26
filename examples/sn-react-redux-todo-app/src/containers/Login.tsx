import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { Repository } from '@sensenet/client-core'
import { Actions } from '@sensenet/redux'
import React from 'react'
import { connect } from 'react-redux'
import { rootStateType } from '..'
import { reactControlMapper } from '../../../../packages/sn-controls-react/dist'

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

const mapDispatchToProps = {
  onSubmit: Actions.userLogin,
}

const userSchema = reactControlMapper(new Repository()).getFullSchemaForContentType('User', 'new')

export class Login extends React.Component<typeof mapDispatchToProps, {}> {
  constructor(props) {
    super(props)
  }
  public render() {
    userSchema.fieldMappings = userSchema.fieldMappings.filter(
      fieldSettings =>
        fieldSettings.fieldSettings.Name === 'LoginName' || fieldSettings.fieldSettings.Name === 'Password',
    )
    return (
      <div style={styles.container as any}>
        <form
          onSubmit={e => {
            e.preventDefault()
            const name = document.getElementById('LoginName')['value']
            const password = document.getElementById('Password')['value']
            this.props.onSubmit(name, password)
          }}>
          <Grid container={true}>
            {userSchema.fieldMappings.map((_e, i) => (
              <Grid item={true} sm={12} md={12} lg={12} key={i}>
                {React.createElement(userSchema.fieldMappings[i].controlType, {
                  ...userSchema.fieldMappings[i].clientSettings,
                  'data-actionName': 'new',
                  'data-fieldValue': '',
                  className: userSchema.fieldMappings[i].clientSettings.key,
                } as any)}
              </Grid>
            ))}
            <Grid item={true} style={styles.buttonRow as any}>
              <Button type="submit" style={styles.button} variant="contained" color="primary">
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
