import axios from "axios";

const API = axios.create({
  baseURL: "https://hirehub-backend-sarim.onrender.com/api"
});

export default API;