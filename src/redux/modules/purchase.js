import {createSelector} from 'reselect';
import {selectorProduct} from "./entities/products"
import {actionOrder, constTypes} from "./entities/orders"

const initialState = {
  quantity: 1,
  showTip: false,
};

const tools = {
  sleep: (time) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), time)
    });
  },
  // 构建订单对象
  genOrder: (productId, getState) => {
    const product = selectorProduct.getProductDetail(getState(), productId);
    const quantity = getState().purchase.quantity;
    const totalPrice = (product.currentPrice * quantity).toFixed(1);
    const text1 = `${quantity}张 | 总价：${totalPrice}`;
    const text2 = product.validityPeriod;
    const order = {
      title: `${product.shop}:${product.product}`,
      orderPicUrl: product.picture,
      channel: '团购',
      statusText: '可使用',
      text: [text1, text2],
      type: constTypes.AVAILABLE_TYPE
    }
    return order
  }
}

// actionTypes
export const actionTypes = {
  SET_ORDER_QUANTITY: "PURCHASE/SET_ORDER_QUANTITY",
  CLOSE_TIP: "PURCHASE/CLOSE_TIP",
  //提交订单相关
  SUBMIT_ORDER_REQUEST: "PURCHASE/SUBMIT_ORDER_REQUEST",
  SUBMIT_ORDER_SUCCESS: "PURCHASE/SUBMIT_ORDER_SUCCESS",
  SUBMIT_ORDER_FAILURE: "PURCHASE/SUBMIT_ORDER_FAILURE"
}

// action creators
export const actionPurchase = {
  //设置下单数量
  setOrderQuantity: quantity => ({
    type: actionTypes.SET_ORDER_QUANTITY,
    quantity
  }),
  //关闭提示弹窗
  closeTip: () => ({
    type: actionTypes.CLOSE_TIP
  }),
  //提交订单
  submitOrder: productId => {
    return (dispatch, getState) => {
      dispatch({type: actionTypes.SUBMIT_ORDER_REQUEST});
      return tools.sleep(500).then(() => {
        const order = tools.genOrder(productId, getState);
        dispatch(actionOrder.addOrder(order));//添加用户订单
        dispatch({type: actionTypes.SUBMIT_ORDER_SUCCESS});
      })
    }
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ORDER_QUANTITY:
      return {...state, quantity: action.quantity}
    case actionTypes.CLOSE_TIP:
      return {...state, showTip: false}
    case actionTypes.SUBMIT_ORDER_SUCCESS:
      return {...state, showTip: true}
    default:
      return state;
  }
}

export default reducer;

//selectors
export const selectorPurchase = {
  getQuantity: (state) => {
    return state.purchase.quantity
  },
  getTipStatus: (state) => {
    return state.purchase.showTip
  },
  getProduct: (state, id) => {
    return selectorProduct.getProductDetail(state, id)
  },
  // reselect 获取总价
  getTotalPrice: (state, productId) => {
    //! 因为reselect初始化时需要对应的select,但select对象还未初始化完成,
    //! 所有这里在外面多包裹了一层函数,进行了延时触发.
    return createSelector([selectorPurchase.getProduct, selectorPurchase.getQuantity], (product, quantity) => {
      if (!product) product = 0
      return (product.currentPrice * quantity).toFixed(2);
    })(state,productId)
  }
}