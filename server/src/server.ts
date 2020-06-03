import dotenv from 'dotenv'
import express from "express"
import cors from 'cors'
import path from 'path'
import routes from './routes'

dotenv.config()

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(cors())

// Rotas
app.use(routes)

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.listen(PORT, () => 
    console.log(`Server in http://localhost:${PORT}`))