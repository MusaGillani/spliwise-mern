import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import httpStatus from 'http-status'

export const validate = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)))

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    res.status(httpStatus.BAD_REQUEST).json({
      errors: errors.array()
    })
  }
}

export const reqBodyTokenLog = (req: Request) => {
  return JSON.stringify(req.body)
}
