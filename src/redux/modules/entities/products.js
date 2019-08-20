//! ids 和 entities分开存储
// modules中只保存ids,存储顺序.
// entities 储存真正的数据内容
import createReducer from "../../../utils/createReducer";

const schemaName = 'products'
// 用于扁平化response结构
export const schemaProduct = {
  name: schemaName, // 实体名
  id: 'id' //实体主键索引
}

//reducer 提取action.response[schemaName]类型的领域数据
const reducer = createReducer(schemaProduct.name);
export default reducer;

// selectors
export const selectorProduct = {
  getProductDetail: (state, id) => {
    const product = state.entities[schemaName][id];
    return (product && product.detail && product.purchaseNotes) ? product : null;
  },
  getProductById: (state, id) => {
    return state.entities[schemaName][id];
  }
}
