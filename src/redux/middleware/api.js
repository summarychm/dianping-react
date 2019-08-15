import {get} from "../../utils/request";

// 如果action包含该属性,则让触发该中间件
export const FETCH_DATA = "FETCH_DATA";

export default store => next => action => {
  const fetchOptions = action[FETCH_DATA];
  // 不包含指定属性,则跳过,让其他中间件处理
  if (!fetchOptions) return next(action);

  const {endpoint, schema, types} = fetchOptions;
  if (typeof endpoint !== 'string')
    throw new Error('endpoint必须为字符串类型的URL')
  if (!schema)
    throw new Error('必须指定领域实体的schema')
  if (!Array.isArray(types) && types.length !== 3)
    throw new Error('需要指定一个包含了3个action type的数组')
  if (!types.every(type => typeof type === 'string'))
    throw new Error('action type必须为字符串类型')

  // 解耦fetch三状态
  const [requestType, successType, failureType] = types;


  finalNext({type: requestType}, action);//发出request状态
  return fetchData(endpoint, schema).then(response => {
    const data = {type: successType, response}
    finalNext(data, action);//成功获取完数据
  }, err => {
    const data = {type: failureType, error: err.message || "获取数据失败!"};
    finalNext(data, action);//获取数据失败
  })
}
// 获取 data并序列化
const fetchData = (endpoint, schema) => {
  return get(endpoint).then(data => normalizeData(data, schema))
}
// 根据schema扁平化data
const normalizeData = (data, schema) => {
  let kvObj = {},
    ids = [];
  const [id, name] = schema;
  // 返回值为array类型数据
  if (Array.isArray(data)) {
    data.forEach(item => {
      let key = item[id];
      kvObj[key] = item;
      ids.push(item);
    });
  } else {
    let key = data[id];
    kvObj[key] = data;
    ids.push(data);
  }
  return {[name]: kvObj, ids}
}

// 修正action,删除FETCH_DATA属性
const actionWith = data => {
  const finalAction = {...action, ...data};
  delete finalAction[FETCH_DATA];// 删除特殊属性
  return finalAction;
}
// 派发修正过的action
const finalNext = (data, oldAction) => {next(actionWith(data, oldAction))}
