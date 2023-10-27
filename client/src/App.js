import './App.css';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Landing from './components/layout/Landing';
import Navbar from './components/layout/Navbar';
import { Provider } from 'react-redux';
import Alert from './components/layout/Alert';
import store from './store';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/Auth_action';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/posts/Post';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <section className='container'>
          <Alert />
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/profiles' element={<Profiles />} />
            <Route path='/profile/:id' element={<Profile />} />
            <Route
              path='/dashboard'
              element={<PrivateRoute element={<Dashboard />} />}
            />
            <Route
              path='/create-profile'
              element={<PrivateRoute element={<CreateProfile />} />}
            />
            <Route
              path='/edit-profile'
              element={<PrivateRoute element={<EditProfile />} />}
            />
            <Route
              path='/add-experience'
              element={<PrivateRoute element={<AddExperience />} />}
            />
            <Route
              path='/add-education'
              element={<PrivateRoute element={<AddEducation />} />}
            />
            <Route
              path='/posts'
              element={<PrivateRoute element={<Posts />} />}
            />
            <Route
              path='/post/:id'
              element={<PrivateRoute element={<Post />} />}
            />
          </Routes>
        </section>
      </Router>
    </Provider>
  );
};

export default App;
