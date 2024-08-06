import express, { Application } from 'express'
import router from './routes/connections'

const app: Application = express()

app.use('/', router);

export default app;