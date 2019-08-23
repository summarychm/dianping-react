import {combineReducers} from "redux";
import entities from "./entities";
import home from "./home";
import search from "./search";
import detail from './detail';
import app from "./app";
import login from "./login";
import user from "./user";
import purchase from "./purchase";

const rootReducer = combineReducers({
  app,
  login,
  entities,
  home,
  detail,
  search,
  user,
  purchase,
});
export default rootReducer;
