import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {selectorLogin} from "../../redux/modules/login";

class PrivateRoute extends Component {
  render() {
    const {component: Component, isLogin, ...rest} = this.props;
    return (
      <Route
        {...rest}
        render={props => {
          const state = {
            pathname: '/login',
            state: {from: props.location}
          };
          return (isLogin ? <Component {...props} /> : <Redirect to={state} />)
        }}
      />
    )
  }
}
const mapStateToProps = (state, props) => {
  return {isLogin: selectorLogin.isLogin(state)}
}
export default connect(mapStateToProps, null)(PrivateRoute)