import api from "./api";

export const getAllCategoriesApi = (config) => {
  return api.get("/api/category/getall", config);
};