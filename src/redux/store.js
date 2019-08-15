import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';

import api from "./middleware/api";
import rootReducer from './modules';

let composeEnhancer = compose;
// 非生产模式开启redux-dev-tools
if (process.env.NODE_ENV !== "production" && window.__REDUX_DEVTOOLS_EXTENSION__) {
  composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
}
let enhancer = composeEnhancer(applyMiddleware(thunk,api));
let store = createStore(rootReducer, enhancer);

export default store;
