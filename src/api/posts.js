import axios from "config/axios";

export const ApiGetListPosts = async ({ userId = "" }) => {
  const response = axios.get(`/posts?userId=${userId}`);
  return response;
};

export const ApiGetListPostsComments = async ({ postId = "" }) => {
  const response = axios.get(`/posts/${postId}/comments`);
  return response;
};

export const ApiGeDetailPosts = async ({ postId = "" }) => {
  const response = axios.get(`/posts/${postId}`);
  return response;
};

export const ApiAddPost = async ({ payload = {} }) => {
  const response = axios.post(`/posts`, payload, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  return response;
};

export const ApiUpdatePosts = async ({ postId = "", payload = {} }) => {
  const response = axios.put(`/posts/${postId}`, payload, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  return response;
};

export const ApiDeletePosts = async ({ postId = "" }) => {
  const response = axios.delete(`/posts/${postId}`);
  return response;
};
