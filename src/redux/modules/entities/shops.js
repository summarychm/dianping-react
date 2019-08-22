import createReducer from "../../../utils/createReducer";

const schemaName = "shops";
export const schemaShop = {
  name: schemaName,
  id: "id"
};

// 获取领域实体
const reducer = createReducer(schemaName);
export default reducer;

// selectors
export const selectorShop = {
  getShopById: (state, id) => state.entities[schemaName][id]
};
