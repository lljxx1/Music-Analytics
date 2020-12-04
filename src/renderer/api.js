import axios from 'axios'

const api = axios.create({
  baseURL: "http://localhost:8956",
  timeout: 20 * 1000
});

export default api