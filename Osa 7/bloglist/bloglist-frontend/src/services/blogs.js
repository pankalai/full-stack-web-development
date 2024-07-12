import axios from "axios";
import userService from "./user";

const baseUrl = "/api/blogs";

const getConfig = () => ({
  headers : { Authorization: `Bearer ${userService.loadUser().token}` }
})

const get = async (id) => {
  const response = await axios.get(baseUrl + `/${id}`);
  return response.data;
}

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject, getConfig());
  return response.data;
};

const update = async (object) => {
  const response = await axios.put(baseUrl + `/${object.id}`, object, getConfig());
  return response.data;
};

const remove = async (id) => {
  const response = await axios.delete(baseUrl + `/${id}`, getConfig());
  return response.data;
};

const comment = async (id, comment) => {
  const response = await axios.post(baseUrl + `/${id}/comments`, { comment });
  return response.data;
}

export default { get, getAll, create, update, remove, comment };
