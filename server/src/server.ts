import dotenv from 'dotenv'
import express from "express"

dotenv.config()
const PORT = process.env.PORT || 3000

const app = express()

app.get('/users', (req, res,) => {
    res.json(["Thomaz"])
})

app.listen(PORT, () => 
    console.log(`Server in http://localhost:${PORT}`))