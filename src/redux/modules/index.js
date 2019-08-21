import {combineReducers} from "redux";
import entities from "./entities";
import home from "./home";
import search from "./search";
import detail from './detail';
import app from "./app";

const rootReducer = combineReducers({
  entities,
  home,
  detail,
  search,
  app
});
export default rootReducer;
