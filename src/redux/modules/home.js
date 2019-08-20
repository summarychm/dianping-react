//! ids 和 entities分开存储
// modules中只保存ids,存储顺序.
// entities 储存真正的数据内容

import {combineReducers} from 'redux';

import urls from "../../utils/urls"; // url信息
import {FETCH_DATA} from "../middleware/entitiesMiddle";
import {schemaProduct} from "./entities/products"; //涉及到的数据实体


const tools = {
  // 请求参数使用到的常量对象
  params: {
    PATH_LIKES: "likes",
    PATH_DISCOUNTS: "discounts",
    PAGE_SIZE_LIKES: 5,
    PAGE_SIZE_DISCOUNTS: 3
  },
  // 二级state
  initialState :{
    likes: {
      isFetching: false,
      pageCount: 0,
      ids: []
    }, discounts: {
      isFetching: false,
      pageCount: 0,
      ids: []
    },
  },
  // 构建用于获取当前module对应sentities的action(没有action,通过特殊属性在redux自定义中间件拦截)
  getFetchLikes: (endpoint) => ({
    [FETCH_DATA]: {
      types: [
        actionTypes.FETCH_LIKES_REQUEST,
        actionTypes.FETCH_LIKES_SUCCESS,
        actionTypes.FETCH_LIKES_FAILURE,
      ],
      endpoint,
      schema: schemaProduct,
    },
  }),
  getFetchDiscounts: (endpoint) => ({
    [FETCH_DATA]: {
      types: [
        actionTypes.FETCH_DISCOUNTS_REQUEST,
        actionTypes.FETCH_DISCOUNTS_SUCCESS,
        actionTypes.FETCH_DISCOUNTS_FAILURE,
      ],
      endpoint,
      schema: schemaProduct,
    },
  }),
  // 猜你喜欢 reducers
  likesReducer: (state = tools.initialState.likes, action) => {
    switch (action.type) {
      case actionTypes.FETCH_LIKES_REQUEST:
        return {...state, isFetching: true};
      case actionTypes.FETCH_LIKES_SUCCESS:
        return {
          ...state,
          isFetching: false,
          pageCount: state.pageCount + 1,
          ids: state.ids.concat(action.response.ids)// 合并ids
        }
      case actionTypes.FETCH_LIKES_FAILURE:
        return {...state, isFetching: false}; // 详情
      default:
        return state;
    }
  },
  // 特惠信息 reducer
  discountsReducer: (state = tools.initialState.discounts, action) => {
    switch (action.type) {
      case actionTypes.FETCH_DISCOUNTS_REQUEST:
        return {...state, isFetching: true};
      case actionTypes.FETCH_DISCOUNTS_SUCCESS:
        return {
          ...state,
          isFetching: false,
          ids: state.ids.concat(action.response.ids)// 合并ids
        }
      case actionTypes.FETCH_DISCOUNTS_FAILURE:
        return {...state, isFetching: false}; // 详情
      default:
        return state;
    }
  }
};

 
export const actionTypes = {
  // likes
  FETCH_LIKES_REQUEST: "HOME/FETCH_LIKES_REQUEST",
  FETCH_LIKES_SUCCESS: 'HOME/FETCH_LIKES_SUCCESS',
  FETCH_LIKES_FAILURE: "HOME/FETCH_LIKES_FAILURE",
  // discounts
  FETCH_DISCOUNTS_REQUEST: "HOME/FETCH_DISCOUNTS_REQUEST",
  FETCH_DISCOUNTS_SUCCESS: 'HOME/FETCH_DISCOUNTS_SUCCESS',
  FETCH_DISCOUNTS_FAILURE: "HOME/FETCH_DISCOUNTS_FAILURE",
};

export const actionsHome = {
  loadLikes: () => {// 分页获取likes数据
    return (dispatch, getState) => {
      const {pageCount} = getState().home.likes;//获取每页条数
      const rowIndex = pageCount * tools.params.PAGE_SIZE_LIKES;//limit
      const endpoint = urls.getProductList(tools.params.PATH_LIKES, rowIndex, tools.params.PAGE_SIZE_LIKES);
      return dispatch(tools.getFetchLikes(endpoint));
    }
  },
  loadDiscounts: () => {// 加载特惠商品 actions
    return (dispatch, getState) => {
      const {ids} = getState().home.discounts;
      if (ids && ids.length) return null;
      const endpoint = urls.getProductList(tools.params.PATH_DISCOUNTS, 0, tools.params.PAGE_SIZE_DISCOUNTS);
      return dispatch(tools.getFetchDiscounts(endpoint));
    }
  }
}


const reducer = combineReducers({
  discounts: tools.discountsReducer,
  likes: tools.likesReducer
});

// selectors
export const selectorsHome = {
  // 获取猜你喜欢state
  getLikes: state => {
    return state.home.likes.ids.map(id => state.entities.products[id])
  },
  // 获取特惠商品state
  getDiscounts: state => {
    return state.home.discounts.ids.map(id => {
      return state.entities.products[id]
    })
  },
  // 猜你喜欢当前分页码
  getPageCountOfLikes: state => (state.home.likes.pageCount)
}

export default reducer;