import express from 'express'
import morgan from 'morgan';
import cookieParser from "cookie-parser"
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import chatRoutes from './routes/chat.routes.js'


const app = express()
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use (morgan('dev'))
app.use(express.json())
app.use(cookieParser())

app.use(authRoutes)
app.use(userRoutes)
app.use(chatRoutes)

export default app