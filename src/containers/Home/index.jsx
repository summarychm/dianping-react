import React, {Component} from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

//component
import Discount from "./components/Discount";
// redux
import {
  actions as homeActions,
  getLikes,
  getDiscounts,
  getPageCountOfLikes
} from '../../redux/modules/home';

class Home extends Component {
  componentDidMount(){
    this.props.homeActions.loadDiscounts();
  }
  render() {
    const {likes, discounts, pageCount} = this.props;
    return (
      <div>
        <Discount data={discounts} />
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