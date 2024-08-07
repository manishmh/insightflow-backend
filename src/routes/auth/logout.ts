import { Router, Request, Response, NextFunction } from "express";

const router = Router()

router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        res.send(err)
    })
    res.redirect('login')
})

export default router;