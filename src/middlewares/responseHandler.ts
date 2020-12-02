import { Request, Response, NextFunction } from 'express'

export default function (req: Request, res: Response, next: NextFunction) {
  res.deliver = (status, message, payload?) => {
    res.json({
      status,
      message,
      payload,
    })
  }
  next()
}
