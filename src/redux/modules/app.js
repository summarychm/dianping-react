const initialState = {
  error: null
}
export const actionTypes = {
  CLEAR_ERROR: "APP/CLEAR_ERROR";
}
export const actions = {
  clearError: () => ({
    type: actionTypes.CLEAR_ERROR
  })
}
const reducer = (state = initialState, action) => {
  const {type, error} = action;
  if (type === actionTypes.CLEAR_ERROR)
    return {...state, error: null}
  else if (error)// 如果有error属性则设置error
    return {...state, error}
  return state;
}

//selectors
export const getError = (state) => {state.app.error}

export default reducer;