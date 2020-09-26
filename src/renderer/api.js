import axios from 'axios'

const api = axios.create({
  baseURL: "http://localhost:8956",
  timeout: 4000
});

export default api