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

// Handeling Error Globally
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            message: err.message,
            error: err.error,
            data: err.data
        });
    } else {
        res.status(500).json({
            message: 'Internal Server Error',
            error: [],
        });
    }
});

app.get('/', (req, res)=>{
    res.status(200).json({message: "server is running"})
})

//importing routes

import UserRoutes from "./routes/user.routes.js"
import PortfolioRoutes from "./routes/portfolio.routes.js"
import ResumeRoutes from './routes/resume.routes.js'
import AssetsRoutes from './routes/assets.routes.js'
import courseRoutes from './routes/course.routes.js';
import notesRoutes from './routes/notes.routes.js';

app.use('/api/v1/users', UserRoutes)
app.use('/api/v1/resume', ResumeRoutes)
app.use('/api/v1/assets', AssetsRoutes)
app.use('/api/v1/portfolio', PortfolioRoutes)
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/notes', notesRoutes);


export default app