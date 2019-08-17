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
  const finalNext = (data) => next(tools.actionWith(action,data));

  finalNext({type: typeRequestStart});//向下派发requestStart指令
  // 发起网络请求
  return tools.fetchData(endpoint, schema).then(response => {
    //数据扁平化后,向下派发requestSuccess指令,携带response属性,
    // 继续让领域实体自身的reducer拦截该action,获取扁平化后的数据
    finalNext({type: typeRequestSuccess, response});
  }, err => {
    finalNext({type: typeRequestFailure, error: err.message || "获取数据失败!"});
  });
}

// 涉及的内部方法
const tools = {
  // 修正action,删除FETCH_DATA属性
  actionWith: (action,data) => {
    const finalAction = {...action, ...data};
    // 因为当前中间件已经缓存了FETCH_DATA属性,所以可以直接删除掉该属性
    delete finalAction[FETCH_DATA];
    return finalAction;
  },
  // 获取entities实体的data集合
  fetchData: (endpoint, schema) => {
    return get(endpoint).then(data => {
      return tools.normalizeData(data, schema)
    })
  },
  // 根据schema扁平化data
  normalizeData: (data, schema) => {
    let kvObj = {},// 存储片平滑后的obj
      ids = []; // 存储obj的顺序
    const {id, name} = schema;// 从schema解构出name和id

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




