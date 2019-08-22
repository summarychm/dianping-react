import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";

import LoginHeader from "./components/LoginHeader";
import LoginForm from "./components/LoginForm";

import {
  actionLogin,
  selectorLogin,
} from "../../redux/modules/login";


class Login extends Component {
  render() {
    const {username, password, isLogin, location: {state}} = this.props;
    if (isLogin) {
      if (state && state.from) return <Redirect to={state.from} />
      return <Redirect to="/user" />;
    }
    return (
      <div>
        <LoginHeader />
        <LoginForm
          username={username}
          password={password}
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
  // input元素改变的响应函数
  handleChange = e => {
    if (e.target.name === "username")
      this.props.actionLogins.setUsername(e.target.value);
    else if (e.target.name === "password")
      this.props.actionLogins.setPassword(e.target.value);
  };
  // 登录
  handleSubmit = () => {
    this.props.actionLogins.login();
  };
}

const mapStateToProps = (state, props) => {
  return {
    username: selectorLogin.getUsername(state),
    password: selectorLogin.getPassword(state),
    isLogin: selectorLogin.isLogin(state)
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    actionLogins: bindActionCreators(actionLogin, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
