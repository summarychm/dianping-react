import React, {Component} from "react";
import ShopItem from "../ShopItem"
import "./style.css"

class ShopList extends Component {
  render() {
    const dataSource = this.props.data;
    return (
      <div className="shopList">
        <div className="shopList__filter">
          <span className="shopList__filterItem">全部商区</span>
          <span className="shopList__filterItem">全部分类</span>
          <span className="shopList__filterItem">智能排序</span>
        </div>
        <div className="shopList__list">
          {dataSource.map((item, index) => {
            return (
              <div key={item.id}>
                <ShopItem data={item} />
                {index < dataSource.length - 1 ? (
                  <div className="shopList__divider" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default ShopList;
