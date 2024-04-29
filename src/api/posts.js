import axios from "config/axios";

export const ApiGetListPosts = async ({ userId = "" }) => {
  const response = axios.get(`/posts?userId=${userId}`);
  return response;
};
