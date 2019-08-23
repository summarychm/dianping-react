import React from 'react';

// 懒加载,利用 import()
export default function asyncComponent(importComponent) {
  return class AsyncComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        component: null
      };
    }
    render() {
      const Component = this.state.component;
      return Component ? <Component {...this.props} /> : null;
    }
    componentDidMount() {
      importComponent().then(mod => {
        // mod 必须是ESM模块
        if (!mod.hasOwnProperty("__esModule")) return;
        this.setState({
          component: mod.default //ESM 规范
        })
      })
    }
  }
}