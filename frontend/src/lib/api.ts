import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8080" });

API.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// 🔐 Auth
export const authApi = {
  login: (body: { email: string; password: string }) =>
    API.post("/auth/login", body),
  register: (body: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => API.post("/auth/register", body),
};

// 📦 Produtos
export const productApi = {
  list: () => API.get("/product"),
  create: (body: any) => API.post("/product", body),
};

// 🛒 Compras
export const purchaseApi = {
  buy: (productId: number) => API.post("/purchases", { productId }),
};

// 🔔 Notificações
export const notificationApi = {
  unread: () => API.get("/notifications/unread"),
  markRead: (id: number) => API.patch(`/notifications/${id}/read`),
};
