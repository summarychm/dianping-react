import createReducer from "../../../utils/createReducer"

const schemaName = 'orders';
export const schemaOrder = {
  name: schemaName,
  id: 'id',
}
export const constTypes = {
  USED_TYPE: 1,// 已消费
  TO_PAY_TYPE: 2, //待付款
  AVAILABLE_TYPE: 3, //可使用
  REFUND_TYPE: 4, //退款
}


const reducer = createReducer(schemaName)
export default reducer;

// selectors
export const selectorOrder = {
  getOrderById: (state, id) => {
    return state.entities[schemaName][id]
  }
}
