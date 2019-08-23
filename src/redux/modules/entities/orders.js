import createReducer from "../../../utils/createReducer"
// 在订单领域实体中会涉及删除指定订单实体操作.
// 所有也会有一系列的redux(actionTypes,actionCreator,reducer)

const schemaName = 'orders';
export const schemaOrder = {
  name: schemaName,
  id: 'id',
}
// 订单类型
export const constTypes = {
  USED_TYPE: 1,// 已消费
  TO_PAY_TYPE: 2, //待付款
  AVAILABLE_TYPE: 3, //可使用
  REFUND_TYPE: 4, //退款
}

// actionType
export const actionTypes = {
  DELETE_ORDER: "ORDERS/DELETE_ORDER"//删除订单
}

// actionCreator
export const actionOrder = {
  // 删除订单
  deleteOrder: (orderId) => ({
    type: actionTypes.DELETE_ORDER,
    orderId
  })
};

const normalReducer = createReducer(schemaName)
const reducer = (state = {}, action) => {
  // 处理删除订单实体action
  if (action.type === actionTypes.DELETE_ORDER) {
    const {[action.orderId]: deleteOrder, ...restOrders} = state;
    return restOrders;
  } else // 其他type继续交由默认的领域reducer进行监听
    return normalReducer(state, action)
}
export default reducer;

// selectors
export const selectorOrder = {
  getOrderById: (state, id) => {
    return state.entities[schemaName][id]
  }
}
