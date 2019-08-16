import React, {Component} from 'react'
import LikeItem from "../LikeItem";
import Loading from "../../../../components/Loading";
import "./styles.css"


export default class LikeList extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.removeListener = false;
  }
  handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    // 屏幕高度
    const screenHeight = document.documentElement.clientHeight;
    // 猜你喜欢距离顶部的高度
    const likeListTop = this.myRef.current.offsetTop;
    // 猜你喜欢自身的高度
    const likeListHeight = this.myRef.current.offsetHeight;
    // 
    if (scrollTop >= (likeListHeight + likeListTop - screenHeight))
      this.props.fetchData();
  }
  componentDidMount() {
    if (this.props.pageCount < 3)
      document.addEventListener("scroll", this.handleScroll)
    else this.removeListener=true;
    if (this.props.pageCount === 0) {
      this.props.fetchData();
    }
  }
  componentDidUpdate(){
    if(this.props.pageCount>=3&&!this.removeListener){
      document.removeEventListener('scroll',this.handleScroll);
      this.removeListener=true;
    }
  }
  render() {
    const {data, pageCount} = this.props;
    return (
      <div ref={this.myRef} className="likeList" >
        <div className="likeList__header">猜你喜欢</div>
        <div className="likeList__list">{
          data.map((item, idx) => {
            return <LikeItem key={idx} data={item} />
          })
        }</div>
        {pageCount < 3 ? <Loading /> : (<a className="likeList__viewAll" >查看更多</a>)}
      </div>
    )
  }
  componentWillUnmount() {
    if(!this.removeListener) //没有被清除的情况在再清除scroll事件
    document.removeEventListener("scroll", this.handleScroll);
  }
}
