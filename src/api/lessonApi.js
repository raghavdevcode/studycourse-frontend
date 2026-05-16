import api from "./api";

export const getLessonsApi = (scid, config) => {
  return api.get(`/api/lesson/get/${scid}`, config);
};