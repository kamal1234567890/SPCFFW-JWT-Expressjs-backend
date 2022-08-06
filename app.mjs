import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { MakananRoute, UsersRoute, PenyakitRoute, PatientRoute } from './routes/index.mjs'
import { getBobotUser } from './controllers/BobotController.mjs'
dotenv.config()
import * as databases from './utils/databases.mjs'

const app = express()
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(cookieParser())
app.use(express.json())
app.use(MakananRoute)
app.use(UsersRoute)
app.use(PenyakitRoute)
app.use(PatientRoute)


app.get('/bobot', getBobotUser)

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.use((req, res) => {
    res.status(404)
    res.send('<h1>404</h1>')
})

app.listen(5000)