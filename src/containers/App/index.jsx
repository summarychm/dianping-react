import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import ErrorToast from "../../components/ErrorToast";
import Home from '../Home';

// actions,selectors
import {actions as appActions, getError} from '../../redux/modules/app';

class App extends React.Component {
  // constructor(props) {
  //   super(props);
  // }
  render() {
    // 从state中解构error信息
    const {error, appActions: {clearError}} = this.props;
    return (
      <div className="App">
        <Router>
          <Switch>
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
    error: getError(state)
  }
}
const mapDispatchToProps = (dispatch, props) => {
  return {
    appActions: bindActionCreators(appActions, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);