import { Router } from "express";
import ConnectionsRouter from "./connections/connections";
import newConnectionRouter from "./connections/new";
import googleOauthRouter from './auth/login'
import logoutRouter from './auth/logout'

const router = Router();

router.use(ConnectionsRouter);
router.use(newConnectionRouter);
router.use(googleOauthRouter)
router.use(logoutRouter)

export default router;