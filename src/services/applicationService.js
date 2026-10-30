
import api from "./api";

const API_URL = "/applications";

export const getApplications = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

export const getApplicationById = async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data;
};

export const createApplication = async (application) => {
  const response = await api.post(API_URL, application);
  return response.data;
};

export const updateApplication = async (id, application) => {
  const response = await api.put(`${API_URL}/${id}`, application);
  return response.data;
};

export const deleteApplication = async (id) => {
  await api.delete(`${API_URL}/${id}`);
};

export const searchApplications = async ({
  search = "",
  status = "",
  page = 0,
  size = 10,
  sortBy = "applicationDate",
  direction = "desc"
}) => {
  const response = await api.get(`${API_URL}/search`, {
    params: {
      search: search || undefined,
      status: status || undefined,
      page,
      size,
      sortBy,
      direction
    }
  });

  return response.data;
};
