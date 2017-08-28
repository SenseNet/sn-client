import * as React from 'react';
import './Sensenet.css';
import { styles } from './SensenetStyles'
import 'typeface-roboto'
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  withRouter
} from 'react-router-dom'
import { Reducers, Actions } from 'sn-redux'
import { Dashboard } from './pages/Dashboard'
import Login from './pages/Login'
import { Registration } from './pages/Registration'

interface ISensenetProps {
  store,
  repository,
  loginState,
  loginError: string,
  loginClick: Function,
  registrationClick: Function
}

class Sensenet extends React.Component<ISensenetProps, { isAuthenticated: boolean, params, loginError }> {
  public name: string = '';
  public password: string = '';

  constructor(props, context) {
    super(props, context)

    this.state = {
      params: this.props,
      isAuthenticated: false,
      loginError: this.props.loginError || ''
    }
  }

  render() {
    return (
      <div className='Sensenet'>
        <Route
          exact
          path='/'
          render={routerProps => {
            const status = this.props.loginState === 1;
            return status ?
              <Redirect key='login' to='/login' />
              : <Dashboard {...routerProps} />;
          }}
        />
        <Route
          path='/login'
          render={routerProps => {
            const status = this.props.loginState === 1;
            return status ?
              <Login login={this.props.loginClick} params={{ error: this.props.loginError }} />
              : <Redirect key='dashboard' to='/' />
          }}
        />
        < Route path='/registration' render={() => <Registration registration={this.props.registrationClick} props={{ name: this.name, password: this.password }} />} />
      </div>
    );
  }
}

const mapStateToProps = (state, match) => {
  return {
    loginState: Reducers.getAuthenticationStatus(state.sensenet),
    loginError: Reducers.getAuthenticationError(state.sensenet),
    store: state
  }
}

const userLogin = Actions.UserLogin;
const userRegistration = () => { };

export default withRouter(connect(
  mapStateToProps,
  {
    loginClick: userLogin,
    registrationClick: userRegistration
  })(Sensenet));
