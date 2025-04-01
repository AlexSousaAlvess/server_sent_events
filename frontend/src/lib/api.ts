import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8080" });

API.interceptors.request.use((config:any) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

export const productApi = {
  list: () => API.get("/product"),
  create: (body:any) => API.post("/product", body),
};

export const purchaseApi = {
  buy: (productId: number) => API.post("/purchases", { productId }),
};

export const notificationApi = {
  unread: () => API.get("/notifications/unread"),
  markRead: (id: number) => API.patch(`/notifications/${id}/read`),
};
