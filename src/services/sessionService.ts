import { User } from "../models/User";

const sessionService = {
  getUser: () => {
    const userString = localStorage.getItem("user");
    if (!userString) {
      console.warn("Nenhum dado de usuário encontrado no localStorage.");
      return null; // Retorna null caso o dado não exista
    }
  },

  getToken: () => {
    return localStorage.getItem("token") || null;
  },

  saveSession: (user: any, token: string) => {
    localStorage.setItem("user", user);
    localStorage.setItem("token", token);
  },

  clearSession: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },
};

export { sessionService };
