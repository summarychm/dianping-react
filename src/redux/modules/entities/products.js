const schemaName = 'products'

// 用于fetch扁平化表结构
export const schema = {
  name: schemaName,
  id: 'id'
}
const reducer = (state = {}, action) => {
  // 监控action中是否有response类型的数据,提取其中的products数据
  if (action.response && action.response[schemaName])
    return {...state, ...action.response[schemaName]};
  //! ids还未处理
  return state;
}

export default reducer;