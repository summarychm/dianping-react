import {get} from "../../utils/request";

// 如果action包含该属性,则拦截该中间件
export const FETCH_DATA = "FETCH_DATA";

// 根据action中FETCH_DATA属性获取entities信息
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
  const [typeRequestStart, typeRequestSuccess, typeRequestFailure] = types;

  // 使用之后的dispatch处理修正后的action
  const finalNext = (data) => next(tools.actionWith(data, action));

  finalNext({type: typeRequestStart});
  // 发起网络请求
  return tools.fetchData(endpoint, schema).then(response => {
    finalNext({type: typeRequestSuccess, response});//成功获取完数据
  }, err => {
    finalNext({type: typeRequestFailure, error: err.message || "获取数据失败!"});//获取数据失败
  });
}

// 涉及的内部方法
const tools = {
  // 修正action,删除FETCH_DATA属性
  actionWith: (data,action) => {
    const finalAction = {...action, ...data};
    delete finalAction[FETCH_DATA];// 删除特殊属性
    return finalAction;
  },
  // 获取 data并序列化
  fetchData: (endpoint, schema) => {
    return get(endpoint).then(data => {
      return tools.normalizeData(data, schema)
    })
  },
  // 根据schema扁平化data
  normalizeData: (data, schema) => {
    let kvObj = {},
      ids = [];
    const {id, name} = schema;

    // 返回值为array类型数据
    if (Array.isArray(data)) {
      data.forEach(item => {
        let key = item[id];
        kvObj[key] = item;
        ids.push(key);
      });
    } else {
      let key = data[id];
      kvObj[key] = data;
      ids.push(key);
    }
    return {[name]: kvObj, ids}
  }
}




