import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from 'react-redux'
import {
  Routes, 
  Route, 
  Link, 
  useMatch
} from 'react-router-dom'
import { 
  Container, 
  AppBar, 
  Toolbar,
  Button,
  Switch,
  ThemeProvider,
  FormControlLabel,
  Box,
  IconButton
} from '@mui/material'

import LoginForm from "./components/LoginForm";
import Blogs from "./components/Blogs";
import Notification from "./components/Notification";
import Users from "./components/Users";
import User from "./components/User";
import BlogInfo from "./components/BlogInfo";

import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser, logoutUser } from './reducers/userReducer'

import usersService  from './services/users'

import ThemeContext from './contexts/ThemeContext'



const App = () => {
  
  const dispatch = useDispatch()

  // Initialize the blogs and user
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    dispatch(initializeUser())
  }, []);


  // Get all users
  const [users, setUsers] = useState([]);
  useEffect(() => {
    usersService.getAll().then(users => setUsers(users));
  },[])

  // Get the current user and blogs
  const currentUser = useSelector(state => state.user)
  const blogs = useSelector(state => state.blogs)

  // Match the user and blog
  const matchUser = useMatch('/users/:id')
  const user = matchUser
    ? users.find(user => user.id === matchUser.params.id)
    : null

  const matchBlog = useMatch('/blogs/:id')
  const blog = matchBlog
    ? blogs.find(blog => blog.id === matchBlog.params.id)
    : null

  // Styling
  const padding = {
    padding: 5
  }

  // Themes
  const [theme, dispatchTheme] = useContext(ThemeContext) 
  const toggleTheme = (event) => {
    event.target.checked = !event.target.checked
    dispatchTheme({ type: 'TOGGLE_THEME' })
  }

  if (!currentUser) {
    return (
      <div>
        <div>
          <Notification />
        </div>
        <div>
          <h2>Log in to application </h2>
          <LoginForm />
        </div>
      </div>
    )
  }
  
  return (
    <Container>
      <ThemeProvider theme={theme}>
      <div>
        <div>
          <Notification />
        </div>
        <div>
          <AppBar position="static" >
            <Toolbar variant="dense">
              <Button component={Link} to="/">Blogs</Button>
              <Button component={Link} to="/users">Users</Button>
              <FormControlLabel labelPlacement="start" control={
                  <Switch
                    checked={theme.name === 'Dark Theme' ? true : false}
                    onChange={toggleTheme}
                    color={theme.palette.secondary.main}
                  />} 
                  label={theme.name} sx={{ marginLeft: 'auto' }}
                />
              <Box sx={{marginLeft: 'auto'}}>
                {currentUser.username} logged in {' '}
                <Link to='/'>
                  
                  <Button onClick={() => dispatch(logoutUser())}>
                    logout
                    </Button>
                </Link>
              </Box>         
            </Toolbar>
          </AppBar>
          <div>
            <h1>Blog app</h1>
          </div>
          <Routes>           
            <Route path="/" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogInfo blog={blog} />} />
            <Route path="/users" element={<Users users={users} />} />
            <Route path="/users/:id" element={<User user={user} />} />
          </Routes>
        </div>
      </div>
      </ThemeProvider>
    </Container>
  );
};

export default App;
