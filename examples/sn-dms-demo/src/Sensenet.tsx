import * as React from 'react';
import './Sensenet.css';
import { styles } from './SensenetStyles'
import 'typeface-roboto'
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import { Reducers, Actions } from 'sn-redux'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { Registration } from './pages/Registration'

interface ISensenetProps {
  store,
  repository
}

class Sensenet extends React.Component<ISensenetProps, { isAuthenticated: boolean, params }> {
  constructor(props) {
    super(props)

    this.state = {
      params: this.props,
      isAuthenticated: false
    }
  }
  render() {
    return (
      <div className='Sensenet'>
          <Router>
            <div className='Sensenet'>
              <Route exact path='/' render={() => <Dashboard loginState={Reducers.getAuthenticationStatus(this.props.store.sensenet)} />} />
              <Route path='/login' component={Login} />
              <Route path='/registration' component={Registration} />
            </div>
          </Router>
      </div>
    );
  }
}

const mapStateToProps = (state, match) => {
  return {
    loginState: Reducers.getAuthenticationStatus(state.sensenet),
    store: state
  }
}

const userLogin = Actions.UserLogin;
const userRegistration = () => { };

export default connect(
  mapStateToProps,
  {
    loginClick: userLogin,
    registrationClick: userRegistration
  })(Sensenet);
