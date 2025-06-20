export interface JwtPayload {
  sub: string;
  username: string;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
}

export interface LoginUser {
  token: string;
  expiresIn: string;
}
