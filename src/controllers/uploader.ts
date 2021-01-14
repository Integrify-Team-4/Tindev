import { Request, Response, NextFunction } from 'express'
import aws from 'aws-sdk'

import {
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
  BadRequestError,
} from '../helpers/apiError'
aws.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
})
const S3_BUCKET = process.env.bucket
export const uploadImages = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const s3 = new aws.S3()
    const fileName = req.body.fileName
    const fileType = req.body.fileType
    const s3Params = {
      Bucket: 'tindev-dev-test',
      Key: fileName,
      Expires: 5000,
      ContentType: fileType,
      ACL: 'public-read',
    }
    s3.getSignedUrl('putObject', s3Params, (e, data) => {
      if (e) {
        return next(new InternalServerError(e.message))
      }
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
      }
      res.json({ success: true, data: { returnData } })
    })
  } catch (e) {
    next(new InternalServerError(e))
  }
}
