import axios from "axios";

export const personApi = axios.create({
  baseURL: "http://localhost:8087",
});

export const notificationApi = axios.create({
  baseURL: "http://localhost:8088",
});