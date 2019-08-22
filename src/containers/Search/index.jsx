import React, {Component} from 'react'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import SearchBox from "./components/SearchBox";
import PopularSearch from "./components/PopularSearch";
import SearchHistory from "./components/SearchHistory";

import {actionSearch, selectorKeywords} from "../../redux/modules/search";

class Search extends Component {
  render() {
    const {
      inputText,
      popularKeywords,
      relatedKeywords,
      historyKeywords,
    } = this.props;
    return (
      <div>
        <SearchBox
          inputText={inputText}
          relatedKeywords={relatedKeywords}
          onChange={this.handleChangeInput}
          onClear={this.handleClearInput}
          onCancel={this.handleCancel}
          onClickItem={this.handleClickItem}
        />
        <PopularSearch
          data={popularKeywords}
          onClickItem={this.handleClickItem}
        />
        <SearchHistory
          data={historyKeywords}
          onClickItem={this.handleClickItem}
          onClear={this.handleClearHistory}
        />
      </div>
    )
  }
  componentDidMount() {
    // 获取最新的热门关键词
    this.props.actionSearch.loadPopularKeywords()
  }
  // 更新搜索框文本到redux
  handleChangeInput = text => {
    const {setInputText, loadRelatedKeywords} = this.props.actionSearch;
    setInputText(text);
    loadRelatedKeywords(text);

  }
  // 清除搜索框文本
  handleClearInput = () => {
    this.props.actionSearch.clearInputText();
  }
  // 取消搜索
  handleCancel = () => {
    this.props.history.goBack();// 返回上一页
  }
  // 点击关键词逻辑
  handleClickItem = (item) => {
    let {setInputText, addHistoryKeyword, loadRelatedShops} = this.props.actionSearch;
    setInputText(item.keyword); // 更新搜索框
    addHistoryKeyword(item.id); // 添加历史记录
    loadRelatedShops(item.id); // 搜索店铺列表
    this.props.history.push("/search_result");// 跳转到详情页
  }
  // 清空历史记录
  handleClearHistory = () => {
    this.props.actionSearch.clearHistoryKeywords();
  }
  // 卸载前
  componentWillUnmount() {
    this.props.actionSearch.clearInputText();// 清空搜索框
  }
}

const mapStateToProps = (state, props) => {
  return {
    inputText: selectorKeywords.getInputText(state),
    relatedKeywords: selectorKeywords.getRelatedKeywords(state),
    popularKeywords: selectorKeywords.getPopularKeywords(state),
    historyKeywords: selectorKeywords.getHistoryKeywords(state)
  }
}
const mapDispatchToProps = dispatch => {
  return {
    actionSearch: bindActionCreators(actionSearch, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Search);