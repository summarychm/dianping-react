import {combineReducers} from "redux";
import shops from "./shops";
import orders from "./orders";
import comments from "./comments";
import keywords from "./keywords";
import products from "./products";

//合并领域状态
const rootReducer = combineReducers({
  shops,
  orders,
  comments,
  keywords,
  products,
})

export default rootReducer