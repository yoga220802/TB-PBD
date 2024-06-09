import { fetchWithToken, API_BASE_URL } from './utils';

export const fetchUsers = () => {
  return fetchWithToken(`${API_BASE_URL}/users`);
};

export const deleteUser = (userId) => {
  return fetchWithToken(`${API_BASE_URL}/deleteUser/${userId}`, { method: "DELETE" });
};

export const addUser = (userData) => {
  return fetchWithToken(`${API_BASE_URL}/addUser`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
};

export const editUser = (userId, userData) => {
  return fetchWithToken(`${API_BASE_URL}/editUser/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
};

export const fetchUserById = (userId) => {
  return fetchWithToken(`${API_BASE_URL}/users/${userId}`);
};