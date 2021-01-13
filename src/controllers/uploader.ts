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
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey,
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
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 500,
      ContentType: fileType,
      ACL: 'public-read',
    }
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
        console.log(err)
        res.json({ success: false, error: err })
      }
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
      }
      res.json({ success: true, data: { returnData } })
    })
  } catch (e) {
    console.log(e)
  }
}
