import {Router} from "express"
import ConnectionsRouter from "./connections"
import newConnectionRouter from "./new"

const router = Router();

router.use(ConnectionsRouter);
router.use(newConnectionRouter);

export default router;