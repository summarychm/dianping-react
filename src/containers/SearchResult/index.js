import React, {Component} from 'react';
import {connect} from 'react-redux';

import ShopList from "./components/ShopList"
import SearchHeader from "./components/SearchHeader"
import KeywordBox from "./components/KeywordBox"
import Banner from "../../components/Banner"
import {selectorKeywords} from "../../redux/modules/search";

class SearchResult extends Component {
  render() {
    const {shops, currentKeyword} = this.props;
    return (
      <div>
        <SearchHeader
          onBack={this.handleBack}
          onSearch={this.handleSearch}
        />
        <KeywordBox text={currentKeyword} />
        <Banner dark />
        <ShopList data={shops} />
      </div>
    );
  }

  handleBack = () => {
    this.props.history.push('/');// 回首页
  }

  handleSearch = () => {
    this.props.history.push('/search');//搜索
  }
}

const mapStateToProps = (state, props) => {
  return {
    shops: selectorKeywords.getSearchedShops(state),
    currentKeyword: selectorKeywords.getCurrentKeyword(state)
  }
}
export default connect(mapStateToProps, null)(SearchResult);