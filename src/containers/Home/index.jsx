import React, {Component} from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

// component
import Activity from "./components/Activity";
import Banner from "./components/Banner";
import Category from "./components/Category";
import Discount from "./components/Discount";
import Footer from "../../components/Footer";
import HomeHeader from "./components/HomeHeader";
import Headline from "./components/Headline";
import LikeList from "./components/LikeList";


// redux
import {actionsHome, selectorsHome} from '../../redux/modules/home';

class Home extends Component {
  componentDidMount() {
    this.props.actionsHome.loadDiscounts();
  }
  fetchMoreLikes = () => {
    this.props.actionsHome.loadLikes();
  }
  render() {
    const {likes, discounts, pageCount} = this.props;
    return (
      <div>
        <HomeHeader />
        <Banner />
        <Category />
        <Headline />
        <Activity />
        {/* 特惠商品 */}
        <Discount data={discounts} />
        {/* 猜你喜欢 */}
        <LikeList data={likes} pageCount={pageCount} fetchData={this.fetchMoreLikes} />
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state, props) => ({
  likes: selectorsHome.getLikes(state),//猜你喜欢信息
  discounts: selectorsHome.getDiscounts(state),//特惠商品
  pageCount: selectorsHome.getPageCountOfLikes(state)
})
const mapDispatchToProps = (dispatch, props) => ({
  actionsHome: bindActionCreators(actionsHome, dispatch)
})
export default connect(mapStateToProps, mapDispatchToProps)(Home);