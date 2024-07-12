import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/user'
import loginService from '../services/login'


const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        addLogin(state, action) {
          return action.payload
        },
        removeLogin(state, action) {
          return null
        },
  }
})

export const initializeUser = () => {
  const user = userService.loadUser();
  return async dispatch => {
    if (user) {
      const {token, password, ...username} = user;
      dispatch(addLogin(username));
    }
  }
}

export const logoutUser = () => {
  return async dispatch => {
    userService.removeUser();
    dispatch(removeLogin());
  }
}

export const loginUser = (credentials, onSuccess, onFailure) => {
  return async dispatch => {
    try {
      const user = await loginService.login(credentials);
      userService.saveUser(user);
      const {token, password, ...username} = user;
      dispatch(addLogin(username));
      onSuccess();
    } catch (error) {
      onFailure(error);
    }
  }
}


export const { addLogin, removeLogin } = userSlice.actions
export default userSlice.reducer