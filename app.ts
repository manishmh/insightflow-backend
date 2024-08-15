import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import session from 'express-session';
import http from 'http';
import passport from 'passport';
import './src/Auth/auth';
import { isLoggedIn } from './src/middleware/is-logged-in';
import router from './src/routes';

dotenv.config();

const app: Application = express()

const corsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}))

app.use(passport.initialize())
app.use(passport.session())

// routes
app.use(router)

app.get('/', (req: Request, res: Response) => {
  res.send('Insigh Flow Home route! <a href="/oauth2/google/login">Login in with google</a>');
});

app.get('/protected', isLoggedIn, (req: Request, res: Response) => {
  res.send("protected route")
})

const server = http.createServer(app);
const port = process.env.PORT || 8080;

server.listen(port, async () => {
  try {
    console.log(`Server is running on http://localhost:${port}`);

  } catch (error) {
    process.exit(1);
  }
});

export default app;