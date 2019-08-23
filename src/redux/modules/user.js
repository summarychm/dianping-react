import {combineReducers} from "redux"

import urls from "../../utils/urls";
import {FETCH_DATA} from "../middleware/entitiesMiddle";
import {
  schemaOrder,
  selectorOrder,
  constTypes,
  actionOrder,
  actionTypes as orderActionTypes
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
    currentTab: 0, //当前选项卡
    currentOrder: { // 当前选中的订单(可进行删除,评论等操作)
      id: null,
      isDeleting: false,
    }
  },
  fetchOrders: endpoint => ({
    [FETCH_DATA]: {
      types: [
        actionTypes.FETCH_ORDERS_REQUEST,
        actionTypes.FETCH_ORDERS_SUCCESS,
        actionTypes.FETCH_ORDERS_FAILURE
      ],
      endpoint,
      schema: schemaOrder
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
      // 监控order实体和userOrder对象
      case actionTypes.DELETE_ORDER_SUCCESS:
      case orderActionTypes.DELETE_ORDER:
        return {
          ids: tools.removeOrderId(state, "ids", action.orderId),
          toPayIds: tools.removeOrderId(state, "toPayIds", action.orderId),
          availableIds: tools.removeOrderId(state, "availableIds", action.orderId),
          refundIds: tools.removeOrderId(state, "refundIds", action.orderId),
        }
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
  },
  // reducer 处理当前选中的订单
  reducerCurrentOrder: (state = tools.initialState.currentOrder, action) => {
    switch (action.type) {
      case actionTypes.SHOW_DELETE_DIALOG:
        return {
          ...state,
          id:action.orderId,
          isDeleting:true
        }
      // 订单删除后,重置为初始值
      case actionTypes.HIDE_DELETE_DIALOG:
      case actionTypes.DELETE_ORDER_SUCCESS:
      case actionTypes.DELETE_ORDER_FAILURE:
        return tools.initialState.currentOrder;
      default:
        return state;
    }
  },
  // 开始删除订单
  deleteOrderRequest: () => ({
    type: actionTypes.DELETE_ORDER_REQUEST
  }),
  // 订单删除成功
  deleteOrderSuccess: (orderId) => ({
    type: actionTypes.DELETE_ORDER_SUCCESS,
    orderId
  }),
  // 删除state中指定类别中的订单信息
  removeOrderId: (state, key, orderId) => {
    return state[key].filter(id => id !== orderId)
  }
}

// actionType
export const actionTypes = {
  //获取订单列表
  FETCH_ORDERS_REQUEST: "USER/FETCH_ORDERS_REQUEST",
  FETCH_ORDERS_SUCCESS: "USER/FETCH_ORDERS_SUCCESS",
  FETCH_ORDERS_FAILURE: "USER/FETCH_ORDERS_FAILURE",
  //设置当选选中的tab
  SET_CURRENT_TAB: "USER/SET_CURRENT_TAB",
  // 删除订单
  DELETE_ORDER_REQUEST: "USER/DELETE_ORDER_REQUEST",
  DELETE_ORDER_SUCCESS: "USER/DELETE_ORDER_SUCCESS",
  DELETE_ORDER_FAILURE: "USER/DELETE_ORDER_FAILURE",
  //删除确认对话框
  SHOW_DELETE_DIALOG: "USER/SHOW_DELETE_DIALOG",
  HIDE_DELETE_DIALOG: "USER/HIDE_DELETE_DIALOG",
};

// actionCreator
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
  }),
  // 删除订单
  removeOrder: () => {
    return (dispatch, getState) => {
      const {id} = getState().user.currentOrder;
      if (!id) return;
      dispatch(tools.deleteOrderRequest());
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 从订单列表(ids)中删除该订单
          dispatch(tools.deleteOrderSuccess(id));
          // 从订单实体(entities)中删除该订单
          dispatch(actionOrder.deleteOrder(id));
          resolve();
        }, 500);
      })
    }
  },
  //显示删除对话框
  showDeleteDialog: orderId => ({
    type: actionTypes.SHOW_DELETE_DIALOG,
    orderId
  }),
  //隐藏删除对话框
  hideDeleteDialog: () => ({
    type: actionTypes.HIDE_DELETE_DIALOG,
  })
};
// reducer
const reducer = combineReducers({
  orders: tools.reducerOrders,
  currentTab: tools.reducerCurrentTab,
  currentOrder: tools.reducerCurrentOrder,
});
export default reducer;

// selectors
export const selectorUser = {
  getCurrentTab: state => state.user.currentTab,
  // 根据currentTab获取不同类型的order
  getOrders: state => {
    const key = ["ids", "toPayIds", "availableIds", "refundIds"][state.user.currentTab];
    return state.user.orders[key].map(id => selectorOrder.getOrderById(state, id));
  },
  // 获取正在删除的订单Id
  getDeletingOrderId: (state) => {
    return state.user.currentOrder && state.user.currentOrder.isDeleting ? state.user.currentOrder.id : null;
  }
}