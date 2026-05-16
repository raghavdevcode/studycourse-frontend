import api from "./api";

export const getAllSubCategoriesApi = (config) => {
  return api.get("/api/subcategory/getall", config);
};

export const getSubCategoriesByCatApi = (cid, config) => {
  return api.get("/api/subcategory/bycat", {
    params: { cid },
    ...config
  });
};