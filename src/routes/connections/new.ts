import { Request, Response, Router } from 'express';
import fetchMongoDB from '../../connections/mongodb';

const router = Router();

router.get('/connections/new', (req: Request, res: Response) => {
  res.json('/new');
});

router.post('/connections/new', async (req: Request, res: Response) => {
  const { host, user, password, database, connectionString } = req.body;

  console.log("Received connection details:", { host, user, password, database, connectionString });

  try {
    const data = await fetchMongoDB(process.env.MONGODB_URI as string, 'test', 'users')
    console.log(data)
    res.json(data)
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
