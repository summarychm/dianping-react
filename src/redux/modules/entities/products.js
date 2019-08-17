//! ids 和 entities分开存储
// modules中只保存ids,存储顺序.
// entities 储存真正的数据内容

const schemaName = 'products'

// 用于扁平化response结构
export const schema = {
  name: schemaName, // 实体名
  id: 'id' //实体主键索引
}
//reducer 提取action.response中[schemaName]类型的
const reducer = (state = {}, action) => {
  //! 如果action.response[schemaName]有值,则将其缓存到entities集合中
  if (action.response && action.response[schemaName])
    return {...state, ...action.response[schemaName]};
  return state;
}

export default reducer;