import { Request, Response, NextFunction } from 'express'
import Ajv, { JSONSchemaType } from 'ajv'

const ajv = new Ajv()

export function validateSchema<T>(schema: JSONSchemaType<T>) {
  const validate = ajv.compile(schema)
  return (req: Request, res: Response, next: NextFunction): void => {
    const valid = validate(req.body)
    if (!valid) {
      res.status(400).json({ error: 'Invalid data', details: validate.errors })
      return
    }
    return next()
  }
}
