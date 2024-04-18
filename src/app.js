import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'

const app = express()

app.use(
    cookieParser()
)
app.use(
    cors()
)
app.use(
    express.static('public')
)
app.use(
    express.json()
)
app.use(
    express.urlencoded({extended:false})
)

//importing routes

import UserRoutes from "./routes/user.routes.js"

app.use('/api/v1/users', UserRoutes)


export default app