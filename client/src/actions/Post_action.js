import axios from 'axios';

import {
  ADD_COMMENT,
  ADD_POST,
  DELTE_POST,
  GET_POSTS,
  GET_SINGLE_POST,
  POST_ERROR,
  REMOVE_COMMENT,
  UPDATE_LIKES,
} from './Types';
import { setAlert } from './Alert_action';

//!Get posts
export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/posts');
    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error?.response?.statusText,
        status: error?.response?.statusCode,
      },
    });
  }
};

//! Add Like

export const addLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/like/${postId}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: res.data },
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error?.response?.statusText,
        status: error?.response?.statusCode,
      },
    });
  }
};

//! Remove Like

export const removeLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/unlike/${postId}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: res.data },
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error?.response?.statusText,
        status: error?.response?.statusCode,
      },
    });
  }
};

//! Remove Post

export const deletePost = (postId) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/posts/${postId}`);
    dispatch({
      type: DELTE_POST,
      payload: { postId },
    });
    dispatch(setAlert('Post Removed', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error?.response?.statusText,
        status: error?.response?.statusCode,
      },
    });
  }
};

//! add Post

export const addPost = (formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const res = await axios.post('/api/posts/', formData, config);
    dispatch({
      type: ADD_POST,
      payload: res.data,
    });
    dispatch(setAlert('Post Created', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error?.response?.statusText,
        status: error?.response?.statusCode,
      },
    });
  }
};

//! Get Single Post

export const getSinglePost = (postId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/posts/${postId}`);
    dispatch({
      type: GET_SINGLE_POST,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error?.response?.statusText,
        status: error?.response?.statusCode,
      },
    });
  }
};

//! add Comment

export const addComment = (postId, formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const res = await axios.post(
      `/api/posts/comment/${postId}`,
      formData,
      config
    );
    dispatch({
      type: ADD_COMMENT,
      payload: res.data,
    });
    dispatch(setAlert('Comment Added', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error?.response?.statusText,
        status: error?.response?.statusCode,
      },
    });
  }
};

//! delete Comment

export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/posts/comment/${postId}/${commentId}`);
    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId,
    });
    dispatch(setAlert('Comment Removed', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error?.response?.statusText,
        status: error?.response?.statusCode,
      },
    });
  }
};
