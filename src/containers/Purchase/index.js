import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import Header from "../../components/Header";
import PurchaseForm from "./components/PurchaseForm";
import Tip from "../../components/Tip";

import {selectorLogin} from "../../redux/modules/login";
import {actionsDetail} from "../../redux/modules/detail";
import {actionPurchase, selectorPurchase} from "../../redux/modules/purchase";

class Purchase extends Component {
  render() {
    const {product, phone, quantity, showTip,totalPrice} = this.props;
    return (
      <div>
        <Header title="下单" onBack={this.handleBack} />
        {/* 购买商品详情 */}
        {product ? (
          <PurchaseForm
            product={product}
            phone={phone}
            quantity={quantity}
            totalPrice={totalPrice}
            onSubmit={this.handleSubmit}
            onSetQuantity={this.handleSetQuantity}
          />
        ) : null}
        {showTip ? <Tip message="购买成功！" onClose={this.handleCloseTip} /> : null}
      </div>
    );
  }

  componentDidMount() {
    if (!this.props.product) { // 如果商品信息不存在,则尝试获取
      const productId = this.props.match.params.id;
      this.props.actionsDetail.loadProductDetail(productId);
    }
  }

  componentWillUnmount() {
    this.props.actionPurchase.setOrderQuantity(1);// 重置商品数量
  }

  handleBack = () => {
    this.props.history.goBack();
  };

  handleCloseTip = () => {
    this.props.actionPurchase.closeTip();
    this.handleBack();// 回到上一页.
  };

  // 提交订单
  handleSubmit = () => {
    const productId = this.props.match.params.id;
    this.props.actionPurchase.submitOrder(productId);
  };

  //设置购买数量
  handleSetQuantity = quantity => {
    this.props.actionPurchase.setOrderQuantity(quantity);
  };
}

const mapStateToProps = (state, props) => {
  const productId = props.match.params.id;
  return {
    product: selectorPurchase.getProduct(state, productId),// 获取商品详情
    quantity: selectorPurchase.getQuantity(state), // 
    showTip: selectorPurchase.getTipStatus(state), // 弹窗组件
    phone: selectorLogin.getUsername(state), // 从用户信息中获取手机号 
    // reselect 将组件内的价格计算转移到redux中,并使用reselect进行缓存
    totalPrice: selectorPurchase.getTotalPrice(state, productId),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actionPurchase: bindActionCreators(actionPurchase, dispatch),
    actionsDetail: bindActionCreators(actionsDetail, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Purchase);
