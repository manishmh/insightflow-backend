import { Request, Response, Router } from "express";

const router = Router();

router.get('/connections', (req: Request, res: Response) => {
    res.json("/connections data")
})

export default router 