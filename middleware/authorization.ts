import { NextFunction, Response, Request } from "express";
import jwt, { Secret } from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      user?: any;  
    }
  }
}

// interface ExtendedRequest extends Request {
//   user?: any;  
// }

export const tokenAuthorization = (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies.accessToken || req.headers['authorization'] as string;

        if (!accessToken) {
            return res.status(401).json({ error: "Unauthorized, no access token" });
        }

        const checkValidity = jwt.verify(accessToken, process.env.JWT_SECRET_KEY as Secret)

        if (!checkValidity) {
            return res.status(403).json({ error: "invalid token"})
        }

        req.user = checkValidity;
        next()

    } catch (error) {
        return res.status(403)    
    }
}