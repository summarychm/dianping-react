import createReducer from "../../../utils/createReducer"

const schemaName = 'comments';
export const schema = {
  name: schemaName,
  id: "id"
}

export const types = {
  ADD_COMMENT: "COMMENT/ADD_COMMENT"
}

export const actions = {
  addComment: (comment) => ({
    type: types.ADD_COMMENT,
    comment
  })
}

const normalReducer = createReducer(schemaName)
const reducer = (state = {}, action) => {
  if (action.type === types.ADD_COMMENT) // 添加评论
    return {...state, [action.comment.id]: action.comment}
  else //其他情况
    return normalReducer(state, action);
}
export default reducer;