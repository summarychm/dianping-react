import React, {Component} from 'react';
import {connect} from "react-redux"
import {bindActionCreators} from "redux"

import UserMain from "./containers/UserMain"
import UserHeader from "./components/UserHeader"

import {actionLogin} from "../../redux/modules/login"

class User extends Component {
  render() {
    return (
      <div>
        <UserHeader
          onBack={this.handleBack}
          onLogout={this.handleLogout}
        />
        <UserMain />
      </div>
    );
  }
  handleBack = () => {
    this.props.history.push("/")
  }

  handleLogout = () => {
    this.props.actionLogin.logout();
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actionLogin: bindActionCreators(actionLogin, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(User);