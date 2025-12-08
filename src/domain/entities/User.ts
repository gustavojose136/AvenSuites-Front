

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthTokens {
  token: string;
  expiresAt: string;
}

export interface AuthenticatedUser extends User {
  accessToken: string;
  roles: string[];
}

