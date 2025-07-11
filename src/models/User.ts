export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface LoginResponse {
  user?: User;
  token: string;
}
