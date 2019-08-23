
import {combineReducers} from "redux";
import urls from "../../utils/urls";
import {FETCH_DATA} from "../middleware/entitiesMiddle";
import {schemaShop, selectorShop} from "./entities/shops";
import {schemaProduct, selectorProduct} from "./entities/products";


const types = {
  // 获取产品详情
  FETCH_PRODUCT_DETAIL_REQUEST: "DETAIL/FETCH_PRODUCT_DETAIL_REQUEST",
  FETCH_PRODUCT_DETAIL_SUCCESS: "DETAIL/FETCH_PRODUCT_DETAIL_SUCCESS",
  FETCH_PRODUCT_DETAIL_FAILURE: "DETAIL/FETCH_PRODUCT_DETAIL_FAILURE",
  // 获取关联店铺信息
  FETCH_SHOP_REQUEST: "DETAIL/FETCH_PRODUCT_DETAIL_REQUEST",
  FETCH_SHOP_SUCCESS: "DETAIL/FETCH_PRODUCT_DETAIL_SUCCESS",
  FETCH_SHOP_FAILURE: "DETAIL/FETCH_PRODUCT_DETAIL_FAILURE"
};

const tools = {
  initialState: {
    product: {
      isFetching: false,
      id: null
    },
    relatedShop: {
      isFetching: false,
      id: null
    }
  },
  //action 获取商品详情
  actionFetchProductDetail: (endpoint, id) => ({
    [FETCH_DATA]: {
      types: [
        types.FETCH_PRODUCT_DETAIL_REQUEST,
        types.FETCH_PRODUCT_DETAIL_SUCCESS,
        types.FETCH_PRODUCT_DETAIL_FAILURE
      ],
      endpoint,
      schema: schemaProduct
    },
    id
  }),
  actionsFetchShopById: (endpoint, id) => ({
    [FETCH_DATA]: {
      types: [
        types.FETCH_SHOP_REQUEST,
        types.FETCH_SHOP_SUCCESS,
        types.FETCH_SHOP_FAILURE
      ],
      endpoint,
      schema: schemaShop
    },
    id
  }),
  actionsFetchProductDetailSuccess: id => ({
    type: types.FETCH_PRODUCT_DETAIL_SUCCESS,
    id
  }),
  actionsFetchShopSuccess: id => ({
    type: types.FETCH_SHOP_SUCCESS,
    id
  }),
}

//actions
export const actionsDetail = {
  loadProductDetail: id => {
    return (dispatch, getState) => {
      const product = selectorProduct.getProductDetail(getState(), id);
      if (product) //缓存: 如果该商品详情已存在,则不再请求
        return dispatch(tools.actionsFetchProductDetailSuccess(id));
      const endpoint = urls.getProductDetail(id);
      // 重新从服务器获取当前商品详情(领域实体)
      return dispatch(tools.actionFetchProductDetail(endpoint, id));
    }
  },
  loadShopById: id => {
    return (dispatch, getState) => {
      const shop = selectorShop.getShopById(getState(), id);
      if (shop)
        return dispatch(tools.actionsFetchShopSuccess(id));
      const endpoint = urls.getShopById(id);
      return dispatch(tools.actionsFetchShopById(endpoint, id));
    };
  }
};

//reducer
const product = (state = tools.initialState.product, action) => {
  switch (action.type) {
    case types.FETCH_PRODUCT_DETAIL_REQUEST:
      return {...state, isFetching: true}
    case types.FETCH_PRODUCT_DETAIL_SUCCESS:
      return {...state, id: action.id, isFetching: false};
    case types.FETCH_PRODUCT_DETAIL_FAILURE:
      return {...state, isFetching: false, id: null}
    default:
      return state
  }
};
const relatedShop = (state = tools.initialState.relatedShop, action) => {
  switch (action.type) {
    case types.FETCH_SHOP_REQUEST:
      return {...state, isFetching: true};
    case types.FETCH_SHOP_SUCCESS:
      return {...state, id: action.id, isFetching: false};
    case types.FETCH_SHOP_FAILURE:
      return {...state, isFetching: false, id: null};
    default:
      return state;
  }
}
const reducer = combineReducers({
  product,
  relatedShop
})
export default reducer;

//selectors
export const selectorDetail = {
  getProduct: (state, id) => { 
    return selectorProduct.getProductDetail(state, id);
  },
  getRelateShop: (state, productId) => {
    const product = selectorProduct.getProductById(state,productId);
    let shopId = product ? product.nearestShop : null;
    // 如果shopId存在,则尝试获取商户详情
    if (shopId) return selectorShop.getShopById(state, shopId);
    return null;
  }
}