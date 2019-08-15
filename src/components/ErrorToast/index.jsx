import React, {Component} from 'react'
import "./style";
export default class ErrorToast extends Component {
  componetDidMount() {
    this.timer = setTimeout(() => {
      this.props.clearError();
    }, 3000);
  }
  render() {
    let {msg} = this.props;
    return (
      <div className="errorToast">
        <div className="errorToast_text">{msg}</div>
      </div>
    )
  }
  componentWillUnMount() {
    if (this.timer)
      clearTimeout(this.timer)
  }
}
