import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import lusca from 'lusca'
import mongoose from 'mongoose'
import bluebird from 'bluebird'

import { MONGODB_URI } from './util/secrets'
import apiErrorHandler from './middlewares/apiErrorHandler'
import apiContentType from './middlewares/apiContentType'

const app = express()
const mongoUrl = MONGODB_URI

//   .connect(mongoUrl, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
//   })
//   .catch((err: Error) => {
//     console.log(
//       'MongoDB connection error. Please make sure MongoDB is running. ' + err
//     )
//     process.exit(1)
//   })

//**Express configuration*/
app.set('port', process.env.PORT || 3000)

//**Use common 3rd-party middlewares*/
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))

//**All routers here*/

//**Custom API error handler*/
app.use(apiErrorHandler)
app.use(apiContentType)

export default app
