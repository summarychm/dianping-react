import React, {Component} from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

//component
import Activity from "./components/Activity";
import Banner from "./components/Banner";
import Category from "./components/Category";
import Discount from "./components/Discount";
import Footer from "../../components/Footer";
import HomeHeader from "./components/HomeHeader";
import Headline from "./components/Headline";
import LikeList from "./components/LikeList";


// redux
import {
  actions as homeActions,
  getLikes,
  getDiscounts,
  getPageCountOfLikes
} from '../../redux/modules/home';

class Home extends Component {
  componentDidMount() {
    this.props.homeActions.loadDiscounts();
  }
  fetchMoreLikes=()=>{
    this.props.homeActions.loadLikes();
  }
  render() {
    const {likes, discounts, pageCount} = this.props;
    return (
      <div>
        <HomeHeader />
        <Banner />
        <Category />
        <Headline/>
        <Activity/>
        <Discount data={discounts} />
        <LikeList data={likes} pageCount={pageCount} fetchData={this.fetchMoreLikes} />
        <Footer/>
      </div>
    )
  }
}
const mapStateToProps = (state, props) => ({
  likes: getLikes(state),
  discounts: getDiscounts(state),
  pageCount: getPageCountOfLikes(state)
})
const mapDispatchToProps = (dispatch, props) => ({
  homeActions: bindActionCreators(homeActions, dispatch)
})
export default connect(mapStateToProps, mapDispatchToProps)(Home);