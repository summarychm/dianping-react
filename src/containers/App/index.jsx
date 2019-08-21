import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import Home from '../Home';
import ProductDetail from '../ProductDetail';
import Search from "../Search";
import ErrorToast from "../../components/ErrorToast";

import {actions as actionsApp, selectorApp} from '../../redux/modules/app';

class App extends React.Component {
  render() {
    const {error, actionsApp: {clearError}} = this.props;
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path='/detail/:id' component={ProductDetail} />
            <Route path="/search" component={Search} />
            <Route path='/' component={Home} />
          </Switch>
        </Router>
        {error && <ErrorToast msg={error} clearError={clearError} />}
      </div>
    );
  }
}
const mapStateToProps = (state, props) => {
  return {
    error: selectorApp.getError(state)// 从appStare中获取error信息
  }
}
const mapDispatchToProps = (dispatch, props) => {
  return {
    actionsApp: bindActionCreators(actionsApp, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);