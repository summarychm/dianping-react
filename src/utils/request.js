const headers = new Headers({
  "Accept": "application/json",
  "Context-Type": 'application/json'
})
// 封装的get方法
export function get(url) {
  const options = {
    method: "GET",
    headers
  };
  return fetch(url, options).then(response => {
    handleResponse(url, response)
  }).catch(e => {
    console.error(`Request failed. url=${url},Message ${e}`);
    return Promise.reject({error: {message: "Request failed"}});
  });
}
export function post(url, data) {
  const options = {
    method: "POST",
    headers,
    body: data
  };
  return fetch(url, options).then(response => {
    handleResponse(url, response)
  }).catch(e => {
    console.error(`Request failed. url=${url},Message ${e}`);
    return Promise.reject({error: {message: "Request failed"}});
  });
}
// 对返回的数据根据status进行初步处理
function handleResponse(url, data) {
  if (response.status === 200)
    return data.json();
  else {
    console.error(`Request failed. url=${url}`);
    return Promise.reject({error: {message: "Request failed due to server error"}})
  }
}