import express, { Express, NextFunction, Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import LoginRouter from './routes/login';
import RegisterRouter from './routes/register';

dotenv.config();

const app: Express = express();

// Apply middleware
app.use(cookieParser());
app.use(cors());
app.use(express.json());

// Apply routes
app.use('/register', RegisterRouter);
app.use('/login', LoginRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
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
    
    // soket io connection after mongodb established connection
    io.on('connection', (socket) => {
      console.log(socket.id + ' connected');
    
      socket.on('disconnect', () => {
        console.log( socket.id ,'disconnected');
      });
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
});
