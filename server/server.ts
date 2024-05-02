import express, { Express, Response, Request } from 'express';

const port = 8080;

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World! ');
});

app.get('/test', (req: Request, res: Response) => {
  res.send('testtt');
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});