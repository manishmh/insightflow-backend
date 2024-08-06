import { Router, Response, Request } from "express";

const router = Router();

router.get("/connections/new", (req: Request, res: Response) => {
    res.json("/new");
})

router.post("/connections/new", (req: Request, res: Response) => {
    const { name, details } = req.body;
    res.json({name, details});
})

export default router;