//! 如果action.response[schemaName]有值,则将其缓存到entities集合中
const createReducer = entityName => {
  return (state = {}, action) => {
    if (action.response && action.response[entityName])
      return {...state, ...action.response[entityName]}
    return state;
  }
}

export default createReducer;