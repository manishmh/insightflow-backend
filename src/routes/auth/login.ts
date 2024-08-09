import { Router, Request, Response } from "express";
import passport from "passport";

const router = Router();

router.get('/oauth2/google/login', passport.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/plus.login'] }))

router.get('/oauth2/google/callback', 
    passport.authenticate('google', {
      successRedirect: "/protected",
      failureRedirect: "/login?error=LoginFailed",
    })
);

router.get('/login', (req: Request ,res: Response) => {
  res.send("<a href='/oauth2/google/login'>Login with google</a>")
})

export default router