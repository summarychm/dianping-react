import {combineReducers} from "redux"

import urls from "../../utils/urls";
import {FETCH_DATA} from "../middleware/entitiesMiddle";
import {
  schemaOrder,
  selectorOrder,
  constTypes,
} from "./entities/orders";

const tools = {
  initialState: {
    orders: {
      isFetching: false,
      ids: [], //所有订单
      toPayIds: [], //待付款的订单id
      availableIds: [], //可使用的订单id
      refundIds: [] //退款订单id
    },
    currentTab: 0 //当前选项卡
  },
  fetchOrders: endpoint => ({
    [FETCH_DATA]: {
      types: [
        actionTypes.FETCH_ORDERS_REQUEST,
        actionTypes.FETCH_ORDERS_SUCCESS,
        actionTypes.FETCH_ORDERS_FAILURE
      ],
      endpoint,
      schema:schemaOrder
    }
  }),
  // reducer 获取orders
  reducerOrders: (state = tools.initialState.orders, action) => {
    switch (action.type) {
      case actionTypes.FETCH_ORDERS_REQUEST:
        return {...state, isFetching: true};
      case actionTypes.FETCH_ORDERS_SUCCESS:// 按订单类型分别汇总,记录
        const {ids, orders} = action.response;
        const toPayIds = ids.filter(id => orders[id].type === constTypes.TO_PAY_TYPE);
        const availableIds = ids.filter(id => orders[id].type === constTypes.AVAILABLE_TYPE);
        const refundIds = ids.filter(id => orders[id].type === constTypes.REFUND_TYPE);
        return {
          ...state,
          isFetching: false,
          ids: state.ids.concat(ids),
          toPayIds: state.toPayIds.concat(toPayIds),
          availableIds: state.availableIds.concat(availableIds),
          refundIds: state.refundIds.concat(refundIds)
        };
      default:
        return state;
    }
  },
  // reducer 设置currentTab
  reducerCurrentTab: (state = tools.initialState.currentTab, action) => {
    switch (action.type) {
      case actionTypes.SET_CURRENT_TAB:
        return action.index;
      default:
        return state;
    }
  }
}

// actionType
export const actionTypes = {
  //获取订单列表
  FETCH_ORDERS_REQUEST: "USER/FETCH_ORDERS_REQUEST",
  FETCH_ORDERS_SUCCESS: "USER/FETCH_ORDERS_SUCCESS",
  FETCH_ORDERS_FAILURE: "USER/FETCH_ORDERS_FAILURE",
  //设置当选选中的tab
  SET_CURRENT_TAB: "USER/SET_CURRENT_TAB"
};

// actions
export const actionUser = {
  // 获取订单列表
  loadOrders: () => {
    return (dispatch, getState) => {
      const {ids} = getState().user.orders;
      if (ids.length > 0) return null;
      const endpoint = urls.getOrders();
      return dispatch(tools.fetchOrders(endpoint));
    };
  },
  // 切换tab
  setCurrentTab: index => ({
    type: actionTypes.SET_CURRENT_TAB,
    index
  })
};
// reducer
const reducer = combineReducers({
  orders: tools.reducerOrders,
  currentTab: tools.reducerCurrentTab,
})
export default reducer;

// selectors
export const selectorUser = {
  getCurrentTab: state => state.user.currentTab,
  // 根据currentTab获取不同类型的order
  getOrders: state => {
    const key = ["ids", "toPayIds", "availableIds", "refundIds"][state.user.currentTab];
    return state.user.orders[key].map(id => selectorOrder.getOrderById(state, id));
  }
}