export interface IAuthenticatedUserResponse {
  token: string;
  expiresIn: number;
  userId: string;
}
