
const tools = {
  initialState: {
    username: localStorage.getItem('username') || '',
    password: "",
    isFetching: false,
    status: localStorage.getItem('login') || false //登录态标识
  },
  loginRequest: () => ({
    type: actionTypes.LOGIN_REQUEST
  }),
  loginSuccess: () => ({
    type: actionTypes.LOGIN_SUCCESS
  }),
  loginFailure: error => ({
    type: actionTypes.LOGIN_FAILURE,
    error
  }),
  sleep: (time) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), time)
    });
  }
}

// action actionTypes
export const actionTypes = {
  LOGIN_REQUEST: "LOGIN/LOGIN_REQUEST",
  LOGIN_SUCCESS: "LOGIN/LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN/LOGIN_FAILURE",
  LOGOUT: "LOGIN/LOGOUT",
  SET_USERNAME: "LOGIN/SET_USERNAME",
  SET_PASSWORD: "LOGIN/SET_PASSWORD"
};

// action creators
export const actionLogin = {
  // 异步action, 执行登录
  login: () => {
    return (dispatch, getState) => {
      const {username, password} = getState().login;
      if (!(username && username.length && password && password.length))
        return dispatch(tools.loginFailure("用户名和秘密不能为空！"));
      dispatch(tools.loginRequest());
      return tools.sleep(1000).then(() => {
        dispatch(tools.loginSuccess());
        localStorage.setItem('username', username);
        localStorage.setItem('login', true);
      });
      // return new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     dispatch(loginSuccess());
      //     localStorage.setItem('username', username);
      //     localStorage.setItem('login', true);
      //     resolve();
      //   }, 1000);
      // });
    };
  },
  logout: () => {
    localStorage.removeItem('username');
    localStorage.removeItem('login');
    return {
      type: actionTypes.LOGOUT
    };
  },
  setUsername: username => ({
    type: actionTypes.SET_USERNAME,
    username
  }),
  setPassword: password => ({
    type: actionTypes.SET_PASSWORD,
    password
  })
};

// reducer
const reducer = (state = tools.initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_REQUEST:
      return {...state, isFetching: true};
    case actionTypes.LOGIN_SUCCESS:
      return {...state, isFetching: false, status: true};
    case actionTypes.LOGIN_FAILURE:
      return {...state, isFetching: false};
    case actionTypes.LOGOUT:
      return {...state, status: false, username: "", password: ""};
    case actionTypes.SET_USERNAME:
      return {...state, username: action.username};
    case actionTypes.SET_PASSWORD:
      return {...state, password: action.password};
    default:
      return state;
  }
};

export default reducer;

// selectors
export const selectorLogin = {
  getUsername: state => state.login.username,
  getPassword: state => state.login.password,
  isLogin: state => state.login.status
}
