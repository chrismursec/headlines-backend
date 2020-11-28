
declare namespace Express {
  export interface Request {
    userData?: {username: string, userId: string};
  }
}
