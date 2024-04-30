import axios from "config/axios";

export const ApiGetListAlbums = async ({ userId = "" }) => {
  const response = axios.get(`/albums?userId=${userId}`);
  return response;
};

export const ApiGetListPhotoAlbums = async ({ albumId = "" }) => {
  const response = axios.get(`/photos?albumId=${albumId}`);
  return response;
};
