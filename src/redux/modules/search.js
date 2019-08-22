import {combineReducers} from 'redux';

import urls from "../../utils/urls";
import {FETCH_DATA} from "../middleware/entitiesMiddle";
import {schemaKeywords, getKeywordById} from "./entities/keywords";
import {schemaShop, selectorShop} from "./entities/shops";

const tools = {
  initialState: {
    inputText: "",
    popularKeywords: {
      isFetching: false,
      ids: []
    },
    /**
     * 关联关键词 对象结构：
     * {
     *   '火锅': {
     *       isFetching: false,
     *       ids: []
     *    }
     * }
     */
    relatedKeywords: {},
    historyKeywords: [],// 搜索历史记录
    /**
    * searchedShopsByKeywords结构
    * {
    *   'keywordId': {
    *       isFetching: false,
    *       ids: []
    *    }
    * }
    */
    searchedShopsByKeyword: {}
  },
  // reducer 搜索文本
  reducerInputText: (state = tools.initialState.inputText, action) => {
    switch (action.type) {
      case actionTypes.SET_INPUT_TEXT:
        return action.text;
      case actionTypes.CLEAR_INPUT_TEXT:
        return ""
      default:
        return state;
    }
  },
  // reducer 热门搜索
  reducerPopularKeywords: (state = tools.initialState.popularKeywords, action) => {
    switch (action.type) {
      case actionTypes.FETCH_POPULAR_KEYWORDS_REQUEST:
        return {...state, isFetching: true};
      case actionTypes.FETCH_POPULAR_KEYWORDS_SUCCESS:
        return {
          ...state,
          isFetching: false,
          ids: [...state.ids, ...action.response.ids]
        };
      case actionTypes.FETCH_POPULAR_KEYWORDS_FAILURE:
        return {
          ...state,
          isFetching: false
        };
      default:
        return state;
    }
  },
  // reducer 关联关键词,内涵子reducer
  reducerRelatedKeyWords: (state = tools.initialState.relatedKeywords, action) => {
    //! 这里的层级关系为关键字单独对应一个关键词集合
    //! 所以将所有相关处理再进行抽取到子reducer进行处理
    switch (action.type) {
      case actionTypes.FETCH_RELATED_KEYWORDS_REQUEST:
      case actionTypes.FETCH_RELATED_KEYWORDS_SUCCESS:
      case actionTypes.FETCH_RELATED_KEYWORDS_FAILURE:
        return {...state, [action.text]: tools.reducerRelatedKeywordsByText(state[action.text], action)}
      default:
        return state;
    }
  },
  // reducer 关联关键词的子reducer,对应关键词集合的某一键值对
  reducerRelatedKeywordsByText: (state = {isFetching: false, ids: []}, action) => {
    switch (action.type) {
      case actionTypes.FETCH_RELATED_KEYWORDS_REQUEST:
        return {...state, isFetching: true};
      case actionTypes.FETCH_RELATED_KEYWORDS_SUCCESS:
        return {
          ...state,
          isFetching: false,
          // 获取列表顺序
          ids: [...state.ids, ...action.response.ids]
        };
      case actionTypes.FETCH_RELATED_KEYWORDS_FAILURE:
        return {...state, isFetching: false};
      default:
        return state;
    }
  },
  // reducer 根据关键词获取店铺列表,内涵子reducer
  reducerSearchedShopByKeyword: (state = tools.initialState.searchedShopsByKeyword, action) => {
    switch (action.type) {
      case actionTypes.FETCH_SHOPS_REQUEST:
      case actionTypes.FETCH_SHOPS_SUCCESS:
      case actionTypes.FETCH_SHOPS_FAILURE:
        return {
          ...state,
          [action.text]: tools.reducerSearchedShopsByText(state[action.text], action)
        };
      default:
        return state;
    }
  },
  // reducer 搜索店铺列表的子reducer,对应关键词集合的某一键值对
  reducerSearchedShopsByText: (state = {isFetching: false, ids: []}, action) => {
    switch (action.type) {
      case actionTypes.FETCH_SHOPS_REQUEST:
        return {...state, isFetching: true};
      case actionTypes.FETCH_SHOPS_SUCCESS:
        return {
          ...state,
          isFetching: false,
          //! 获取列表顺序,每次都取最新?
          ids: action.response.ids
        };
      case actionTypes.FETCH_SHOPS_FAILURE:
        return {...state, isFetching: false};
      default:
        return state;
    }
  },
  // reducer 历史记录
  reducerHistoryKeywords: (state = tools.initialState.historyKeywords, action) => {
    switch (action.type) {
      case actionTypes.ADD_HISTORY_KEYWORD:
        const data = state.filter(item => item !== action.text)
        return [action.text, ...data]; // 搜索结果不能重复
      case actionTypes.CLEAR_HISTORY_KEYWORDS:
        return [];
      default:
        return state;
    }
  },
  // 获取热门关键词
  fetchPopularKeywords: (endpoint) => ({
    [FETCH_DATA]: {
      types: [
        actionTypes.FETCH_POPULAR_KEYWORDS_REQUEST,
        actionTypes.FETCH_POPULAR_KEYWORDS_SUCCESS,
        actionTypes.FETCH_POPULAR_KEYWORDS_FAILURE
      ],
      endpoint,
      schema: schemaKeywords
    }
  }),
  // 获取相关关键字
  fetchRelatedKeywords: (text, endpoint) => ({
    [FETCH_DATA]: {
      types: [
        actionTypes.FETCH_RELATED_KEYWORDS_REQUEST,
        actionTypes.FETCH_RELATED_KEYWORDS_SUCCESS,
        actionTypes.FETCH_RELATED_KEYWORDS_FAILURE,
      ],
      endpoint,
      schema: schemaKeywords
    },
    text
  }),
  // 获取店铺信息
  fetchRelatedShops: (text, endpoint) => ({
    [FETCH_DATA]: {
      types: [
        actionTypes.FETCH_SHOPS_REQUEST,
        actionTypes.FETCH_SHOPS_SUCCESS,
        actionTypes.FETCH_SHOPS_FAILURE,
      ],
      endpoint,
      schema: schemaShop
    },
    text
  })
}

// actionTypes
export const actionTypes = {
  // 设置当前输入
  SET_INPUT_TEXT: "SEARCH/SET_INPUT_TEXT",
  CLEAR_INPUT_TEXT: "SEARCH/CLEAR_INPUT_TEXT",
  //根据输入的文本获取相关关键词
  FETCH_RELATED_KEYWORDS_REQUEST: "SEARCH/FETCH_RELATED_KEYWORDS_REQUEST",
  FETCH_RELATED_KEYWORDS_SUCCESS: "SEARCH/FETCH_RELATED_KEYWORDS_SUCCESS",
  FETCH_RELATED_KEYWORDS_FAILURE: "SEARCH/FETCH_RELATED_KEYWORDS_FAILURE",
  //获取热门关键词
  FETCH_POPULAR_KEYWORDS_REQUEST: "SEARCH/FETCH_POPULAR_KEYWORDS_REQUEST",
  FETCH_POPULAR_KEYWORDS_SUCCESS: "SEARCH/FETCH_POPULAR_KEYWORDS_SUCCESS",
  FETCH_POPULAR_KEYWORDS_FAILURE: "SEARCH/FETCH_POPULAR_KEYWORDS_FAILURE",
  // 历史查询记录
  ADD_HISTORY_KEYWORD: "SEARCH/ADD_HISTORY_KEYWORD",
  CLEAR_HISTORY_KEYWORDS: "SEARCH/CLEAR_HISTORY_KEYWORDS",
  // 查询店铺信息
  FETCH_SHOPS_REQUEST: "SEARCH/FETCH_SHOPS_REQUEST",
  FETCH_SHOPS_SUCCESS: "SEARCH/FETCH_SHOPS_SUCCESS",
  FETCH_SHOPS_FAILURE: "SEARCH/FETCH_SHOPS_FAILURE",
}
// actions
export const actionSearch = {
  //获取热门关键词
  loadPopularKeywords: () => {
    return (dispatch, getState) => {
      // 获取热门关键词集合
      const {ids} = getState().search.popularKeywords;
      // 如果存在,则直接返回,让其使用缓存
      if (ids.length > 0) return null;
      const endpoint = urls.getPopularKeywords();
      // 获取最新热门关键词
      return dispatch(tools.fetchPopularKeywords(endpoint));
    };
  },
  //根据输入查询相关关键字
  loadRelatedKeywords: text => {
    return (dispatch, getState) => {
      const {relatedKeywords} = getState().search;
      if (relatedKeywords[text]) return null;// 有缓存,则使用缓存
      const endpoint = urls.getRelatedKeywords(text);
      return dispatch(tools.fetchRelatedKeywords(text, endpoint));
    }
  },
  // 根据输入查询店铺列表
  loadRelatedShops: keyword => {
    return (dispatch, getState) => {
      const {searchedShopsByKeyword} = getState().search;
      if (searchedShopsByKeyword[keyword]) return null;
      const endpoint = urls.getRelatedShops(keyword);
      return dispatch(tools.fetchRelatedShops(keyword, endpoint));
    }
  },
  //历史查询记录相关action
  addHistoryKeyword: keywordId => ({
    type: actionTypes.ADD_HISTORY_KEYWORD,
    text: keywordId
  }),
  clearHistoryKeywords: () => ({
    type: actionTypes.CLEAR_HISTORY_KEYWORDS
  }),
  setInputText: text => ({
    type: actionTypes.SET_INPUT_TEXT,
    text
  }),
  clearInputText: () => ({
    type: actionTypes.CLEAR_INPUT_TEXT,
  }),
}
// reducer
const reducer = combineReducers({
  inputText: tools.reducerInputText,
  popularKeywords: tools.reducerPopularKeywords,
  relatedKeywords: tools.reducerRelatedKeyWords,
  historyKeywords: tools.reducerHistoryKeywords,
  searchedShopsByKeyword: tools.reducerSearchedShopByKeyword,
})
export default reducer;

// selector
export const selectorKeywords = {
  // 获取热门关键词
  getPopularKeywords: state => {
    // 根据热门的ids去关键词集合中查找对应的实体集合
    return state.search.popularKeywords.ids.map(id => getKeywordById(state, id));
  },
  // 获取关联关键词
  getRelatedKeywords: state => {
    const text = state.search.inputText;// 用户输入
    if (!text || text.trim().length === 0) return [];
    // 根据text查找缓存
    const relatedKeywords = state.search.relatedKeywords[text];
    if (!relatedKeywords) return [];
    // 获取最新的关键词集合
    return relatedKeywords.ids.map(id => getKeywordById(state, id))
  },
  // 获取用户输入 
  getInputText: state => {
    return state.search.inputText;
  },
  // 获取用户输入
  getHistoryKeywords: state => {
    return state.search.historyKeywords.map(id => getKeywordById(state, id))
  },
  // 获取店铺列表
  getSearchedShops: state => {
    // 从历史记录中取最新一条记录的id
    const keywordId = state.search.historyKeywords[0];
    if (!keywordId) return [];
    const shops = state.search.searchedShopsByKeyword[keywordId];
    if (!shops || !shops.ids) return [];
    return shops.ids.map(id => selectorShop.getShopById(state, id))
  },
  // 获取当前关键字
  getCurrentKeyword: state => {
    // 根据历史记录中最新一条记录的Id,获取关键字text
    const keywordId = state.search.historyKeywords[0];
    if (!keywordId) return "";
    return getKeywordById(state, keywordId).keyword;
  }
}