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
import PortfolioRoutes from "./routes/portfolio.routes.js"
import ResumeRoutes from './routes/resume.routes.js'
import AssetsRoutes from './routes/assets.routes.js'

app.use('/api/v1/users', UserRoutes)
app.use('/api/v1/resume', ResumeRoutes)
app.use('/api/v1/assets', AssetsRoutes)
app.use('/api/v1/portfolio', PortfolioRoutes)



export default app