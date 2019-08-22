import createReducer from "../../../utils/createReducer";

const schemaName = "keywords";
export const schemaKeywords = {
  name: schemaName,
  id: "id"
}

const reducer = createReducer(schemaName);
export default reducer;

// selectors
export const getKeywordById = (state, id) => {
  return state.entities[schemaName][id];
}