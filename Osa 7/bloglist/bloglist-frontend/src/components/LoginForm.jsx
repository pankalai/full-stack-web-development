import { useState } from "react";
import { useDispatch } from 'react-redux'

import { loginUser } from "../reducers/userReducer";
import { showNotification } from "../reducers/notificationReducer";

import { TextField, Button } from "@mui/material";

const LoginForm = () => {
  const dispatch = useDispatch()

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    const onSuccess = () => {
      dispatch(showNotification({ text: `welcome ${username}`, success: true }, 5));
      setUsername("");
      setPassword("");
    }
    const onFailure = (error) => {
      dispatch(showNotification({ text: error.response.data.error, success: false }, 5));
    }

    dispatch(loginUser({ username, password }, onSuccess, onFailure))
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <TextField variant="standard"
            label="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <TextField variant="standard"
            type="password"
            label="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <Button variant="contained" color="primary" type="submit">login</Button>
      </form>
    </div>
  );
};

export default LoginForm;
