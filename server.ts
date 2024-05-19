import express, { Express, NextFunction, Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import LoginRouter from './routes/login';
import RegisterRouter from './routes/register';
import TokenRouter from './routes/token';
import logoutRouter from './routes/logout';
import validateRouter from './routes/validate';

dotenv.config();

const app: Express = express();

const corsOptions = {
  origin: ['http://localhost:3000'],
  optionsSuccessStatus: 200, 
};

// Apply middleware
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());

// Apply routes
app.use('/register', RegisterRouter);
app.use('/login', LoginRouter);
app.use('/token', TokenRouter);
app.use('/logout', logoutRouter);
app.use('/validate', validateRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Bookverse Home route!');
});

// Create HTTP server and Initialize Socket.IO
const server = http.createServer(app);
export const io = new Server(server);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const port = process.env.PORT || 8080;
server.listen(port, async () => {
  try {
    // Connect to MongoDB
    await connectDB(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');
    console.log(`Server is running on http://localhost:${port}`);

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
});
