import url from "../../utils/url";
import {FETCH_DATA} from "../middleware/api";
import {schema} from "./entities/products";

export const actionTypes = {
  FETCH_LIKES_REQUEST: "HOME/FETCH_LIKES_REQUEST",
  FETCH_LIKES_SUCCESS: 'HOME/FETCH_LIKES_SUCCESS',
  FETCH_LIKES_FAILURE: "HOME/FETCH_LIKES_FAILURE",
};

export const actions = {
  loadLikes: () => {//actionFunction
    return (dispatch, getState) => {
      const endpoint = url.getProductList(0, 10);
      return dispatch(getFetchLikes(endpoint));
    }
  }
}
const reducer = (state = {}, action) => {
  switch (action.type) {
    case value:

      break;

    default:
      break;
  }
}

//构造自定义中间件所需的action(3状态type,utl,schema)
const getFetchLikes(endpoint) = ({
  [FETCH_DATA]: {
    types: [
      actionTypes.FETCH_LIKES_REQUEST,
      actionTypes.FETCH_LIKES_SUCCESS,
      actionTypes.FETCH_LIKES_FAILURE,
    ]
    endpoint,
    schema,
  },
})

export default reducer;