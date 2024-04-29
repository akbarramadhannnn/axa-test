import axios from "config/axios";

export const ApiGetListUsers = async () => {
  const response = axios.get(`/users`);
  return response;
};
