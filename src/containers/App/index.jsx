import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";

import './style.css';
import ErrorToast from "../../components/ErrorToast";
// actions,selectors
import {actions as appActions, getError} from '../../redux/modules/app';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {error, appActions: {clearError}} = this.props;
    return (
      <div className="App">
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