import React, {Component} from 'react';
import {connect} from "react-redux"
import {bindActionCreators} from "redux"

import UserMain from "./components/UserMain"
import UserHeader from "./components/UserHeader"

import {actionUser, selectorUser} from "../../redux/modules/user"
import {actionLogin} from "../../redux/modules/login"

class User extends Component {
  render() {
    const {currentTab, orders} = this.props
    return (
      <div>
        <UserHeader onBack={this.handleBack} onLogout={this.handleLogout} />
        <UserMain currentTab={currentTab} data={orders} onSetCurrentTab={this.handleSetCurrentTab} />
      </div>
    );
  }

  componentDidMount() {
    this.props.actionUser.loadOrders()
  }

  handleBack = () => {
    this.props.history.push("/")
  }

  handleLogout = () => {
    this.props.actionLogin.logout();
  }

  handleSetCurrentTab = (index) => {
    this.props.actionUser.setCurrentTab(index)
  }
}

const mapStateToProps = (state, props) => {
  return {
    orders: selectorUser.getOrders(state),
    currentTab: selectorUser.getCurrentTab(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actionUser: bindActionCreators(actionUser, dispatch),
    actionLogin: bindActionCreators(actionLogin, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(User);