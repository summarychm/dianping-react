import React from 'react'
import "./style.css";
export default class ErrorToast extends React.Component {
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
  // componentWillUnmount() {
  //   if (this.timer)
  //     clearTimeout(this.timer)
  // }
}
