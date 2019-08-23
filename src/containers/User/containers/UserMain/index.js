import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import OrderItem from "../../components/OrderItem";
import Confirm from "../../../../components/Confirm";
import {
  actionUser,
  selectorUser,
} from "../../../../redux/modules/user";
import "./style.css";

const tabTitles = ["全部订单", "待付款", "可使用", "退款/售后"];

class UserMain extends Component {
  render() {
    const {currentTab, deletingOrderId, orders} = this.props;
    return (
      <div className="userMain">
        {/* 订单类别 */}
        <div className="userMain__menu">
          {tabTitles.map((item, index) => {
            return (
              <div
                key={index}
                className="userMain__tab"
                onClick={this.handleClickTab.bind(this, index)}
              >
                <span
                  className={
                    currentTab === index
                      ? "userMain__title userMain__title--active"
                      : "userMain__title"
                  }
                >
                  {item}
                </span>
              </div>
            );
          })}
        </div>
        {/* 订单列表 */}
        <div className="userMain__content">
          {orders && orders.length > 0
            ? this.renderOrderList(orders)
            : this.renderEmpty()}
        </div>
        {/* confirm 删除订单 */}
        {deletingOrderId ? this.renderConfirmDialog() : null}
      </div>
    );
  }

  componentDidMount() {
    this.props.actionUser.loadOrders()
  }
  renderOrderList = data => {
    return data.map(item => {
      return (
        <OrderItem
          key={item.id}
          data={item}
          onRemove={() => this.handleRemove(item.id)}
        />
      );
    });
  };
  renderEmpty = () => {
    return (
      <div className="userMain__empty">
        <div className="userMain__emptyIcon" />
        <div className="userMain__emptyText1">您还没有相关订单</div>
        <div className="userMain__emptyText2">去逛逛看有哪些想买的</div>
      </div>
    );
  };

  // 删除对话框
  renderConfirmDialog = () => {
    const {actionUser: {hideDeleteDialog, removeOrder}} = this.props;
    return (
      <Confirm
        content="确定删除该订单吗?" 
        cancelText="取消"
        confirmText="确定"
        onCancel={hideDeleteDialog}
        onConfirm={removeOrder}
      />
    );
  };

  handleRemove = orderId => {
    console.log("orderId",orderId)
    this.props.actionUser.showDeleteDialog(orderId);
  };

  handleClickTab = index => {
    this.props.actionUser.setCurrentTab(index);
  };
}

const mapStateToProps = (state, props) => {
  return {
    currentTab: selectorUser.getCurrentTab(state),
    deletingOrderId: selectorUser.getDeletingOrderId(state),
    orders: selectorUser.getOrders(state),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actionUser: bindActionCreators(actionUser, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserMain);
