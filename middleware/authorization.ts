import { NextFunction, Response, Request } from "express";
import Jwt, { Secret } from 'jsonwebtoken'

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

        Jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as Secret, (err: any, user: any ) => {
          if (err) {
            return res.status(403).json({ error: "invalid access token"})
          }

          console.log(user);
          req.user = user;
        })

        next()

    } catch (error) {
        return res.status(403)    
    }
}