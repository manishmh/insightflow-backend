import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import app from './src/app';

dotenv.config();

const corsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req: Request, res: Response) => {
  res.send('Insigh Flow Home route!');
});

const server = http.createServer(app);

// Error handling middlewares
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8080;
server.listen(port, async () => {
  try {
    console.log(`Server is running on http://localhost:${port}`);

  } catch (error) {
    process.exit(1);
  }
});

export default app;