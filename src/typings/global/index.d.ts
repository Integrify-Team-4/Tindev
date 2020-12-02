declare namespace Express {
  export interface Response {
    deliver: (status: number, message: string, payload?: any) => void
  }
}
