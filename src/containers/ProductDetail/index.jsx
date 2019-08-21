import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import Header from "../../components/Header/index.jsx";
import ProductOverview from "./components/ProductOverview/index.jsx";
import ShopInfo from "./components/Shopinfo/index.jsx";
import Detail from "./components/Detail/index.jsx";
import Remark from "./components/Remark/index.jsx";
import BuyButton from "./components/BuyButton/index.jsx";

import {actionsDetail, selectorDetail} from "../../redux/modules/detail";

class ProductDetail extends Component {
  render() {
    const {product, relatedShop} = this.props;
    return (
      <div>
        <Header title="团购详情" onBack={this.handleBack} grey />
        {/* 商品概述 */}
        {product && <ProductOverview data={product} />}
        {/* 商户性情 */}
        {relatedShop && <ShopInfo data={relatedShop} total={product.shopIds.length} />}
        {product && (
          <>
            {/* 商品详情 */}
            <Detail data={product} />
            {/* 商品评论 */}
            <Remark data={product} />
            {/* 购买 */}
            <BuyButton productId={product.id} />
          </>
        )}
      </div>
    )
  }
  componentDidMount() {
    const {product} = this.props;
    if (!product) {
      const productId = this.props.match.params.id;
      // 获取商品信息
      this.props.actionsDetail.loadProductDetail(productId);
    } else if (!this.props.relatedShop) {
      //获取商户信息,商品信息不存在的情况下,则推迟到DidUpdate时获取商户信息
      this.props.actionsDetail.loadShopById(product.nearestShop);
    }
  }
  componentDidUpdate(preProps) {
    // 第一次获取到产品详情时,因为没有同步获取商户信息,所以改为在此获取商户信息
    if (!preProps.product && this.props.product)
      this.props.actionsDetail.loadShopById(this.props.product.nearestShop);
  }
  handleBack = () => {
    this.props.history.goBack();
  }
}
const mapStateToProps = (state, props) => {
  const productId = props.match.params.id;
  return {
    product: selectorDetail.getProduct(state, productId), //商品信息
    relatedShop: selectorDetail.getRelateShop(state, productId)// 店铺信息
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    actionsDetail: bindActionCreators(actionsDetail, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail)