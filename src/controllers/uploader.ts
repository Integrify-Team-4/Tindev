import { Request, Response, NextFunction } from 'express'
import aws from 'aws-sdk'

import {
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
  BadRequestError,
} from '../helpers/apiError'
import Employer from '../entities/Employer.postgres'
import JobSeeker from '../entities/JobSeeker.postgres'
aws.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
})
const S3_BUCKET = process.env.BUCKET
export const uploadImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const s3 = new aws.S3()
    const user = req.user as Employer | JobSeeker
    if (!user) {
      return next(new NotFoundError())
    }
    const fileName = req.body.fileName
    const fileType = req.body.fileType
    const s3Params = {
      Bucket: 'tindev-dev-test/tindev-image',
      Key: fileName,
      Expires: 300,
      ContentType: fileType,
      ACL: 'public-read',
    }
    let returnData: any = {}
    s3.getSignedUrl('putObject', s3Params, (e: any, data: any) => {
      if (e) {
        return next(new InternalServerError())
      }
      returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
      }
      user.image = returnData.url
      user.save()
      res.json({ success: true, data: { returnData } })
    })
  } catch (e) {
    next(new InternalServerError())
  }
}
