//! ids 和 entities分开存储
// modules中只保存ids,存储顺序.
// entities 储存真正的数据内容

import {combineReducers} from 'redux';

import urls from "../../utils/urls"; // url信息
import {FETCH_DATA} from "../middleware/entitiesMiddle";
import {schema} from "./entities/products"; //涉及到的数据实体

// 请求参数使用到的常量对象
const params = {
  PATH_LIKES: "likes",
  PATH_DISCOUNTS: "discounts",
  PAGE_SIZE_LIKES: 5,
  PAGE_SIZE_DISCOUNTS: 3
};

const initialState = {
  likes: {
    isFetching: false,
    pageCount: 0,
    ids: []
  }, discounts: {
    isFetching: false,
    pageCount: 0,
    ids: []
  },
};

// 构建用于获取当前module对应sentities的action(简化样板代码)
const getFetchLikes = (endpoint) => ({
  [FETCH_DATA]: {
    types: [
      actionTypes.FETCH_LIKES_REQUEST,
      actionTypes.FETCH_LIKES_SUCCESS,
      actionTypes.FETCH_LIKES_FAILURE,
    ],
    endpoint,
    schema,
  },
});
// 构建用于获取当前module对应sentities的action(简化样板代码)
const getFetchDiscounts = (endpoint) => ({
  [FETCH_DATA]: {
    types: [
      actionTypes.FETCH_DISCOUNTS_REQUEST,
      actionTypes.FETCH_DISCOUNTS_SUCCESS,
      actionTypes.FETCH_DISCOUNTS_FAILURE,
    ],
    endpoint,
    schema,
  },
});



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

export const actions = {
  // 分页获取likes数据
  loadLikes: () => {//actionFunction
    return (dispatch, getState) => {
      const {pageCount} = getState().home.likes;
      const rowIndex = pageCount * params.PAGE_SIZE_LIKES;
      const endpoint = urls.getProductList(params.PATH_LIKES, rowIndex, params.PAGE_SIZE_LIKES);
      return dispatch(getFetchLikes(endpoint));
    }
  },
  //加载特惠商品 actions
  loadDiscounts: () => {
    return (dispatch, getState) => {
      const {ids} = getState().home.discounts;
      if (ids && ids.length) return null;
      const endpoint = urls.getProductList(params.PATH_DISCOUNTS, 0, params.PAGE_SIZE_DISCOUNTS);
      return dispatch(getFetchDiscounts(endpoint));
    }
  }
}

// 猜你喜欢 reducers
const likes = (state = initialState.likes, action) => {
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
}
// 特惠信息 reducer
const discounts = (state = initialState.discounts, action) => {
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
const reducer = combineReducers({
  discounts,
  likes
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