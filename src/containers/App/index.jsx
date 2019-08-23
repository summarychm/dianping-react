import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import ErrorToast from "../../components/ErrorToast";
import PrivateRoute from "../PrivateRoute";
import AsyncComponent from "../../utils/AsyncComponent";

// import Home from '../Home';
// import ProductDetail from '../ProductDetail';
// import Search from "../Search";
// import SearchResult from "../SearchResult";
// import Login from "../Login";
// import User from "../User";
// import Purchase from "../Purchase"

import {actions as actionsApp, selectorApp} from '../../redux/modules/app';

//dynamic import() 组件按照路由动态加载
const Home = AsyncComponent(() => import('../Home'));
const ProductDetail = AsyncComponent(() => import('../ProductDetail'));
const Search = AsyncComponent(() => import("../Search"));
const SearchResult = AsyncComponent(() => import("../SearchResult"));
const Login = AsyncComponent(() => import("../Login"));
const User = AsyncComponent(() => import("../User"));
const Purchase = AsyncComponent(() => import("../Purchase"));




class App extends React.Component {
  render() {
    const {error, actionsApp: {clearError}} = this.props;
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path="/login" component={Login} />
            <PrivateRoute path="/user" component={User} />
            <Route path='/detail/:id' component={ProductDetail} />
            <Route path="/search" component={Search} />
            <Route path="/search_result" component={SearchResult} />
            <PrivateRoute path="/purchase/:id" component={Purchase} />
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