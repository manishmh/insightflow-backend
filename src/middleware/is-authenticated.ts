import { Response, Request, NextFunction } from "express";

const IsAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        next()
    }

    res.redirect("/login")
}

export default IsAuthenticated;