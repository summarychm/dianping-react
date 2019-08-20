import createReducer from "../../../utils/createReducer";

export const schemaShop = {
  name: "shops",
  id: "id"
};

// 获取领域实体
const reducer = createReducer(schemaShop.name);
export default reducer;

// selectors
export const selectorShop = {
  getShopById: (state, id) => {
    const shop = state.entities.shops[id];
    return shop;
  }
};
