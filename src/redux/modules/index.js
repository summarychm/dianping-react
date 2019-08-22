import {combineReducers} from "redux";
import entities from "./entities";
import home from "./home";
import search from "./search";
import detail from './detail';
import app from "./app";
import login from "./login";

const rootReducer = combineReducers({
  entities,
  home,
  detail,
  search,
  login,
  app
});
export default rootReducer;
