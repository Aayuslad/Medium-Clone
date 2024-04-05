import { Hono } from "hono";
const router = new Hono();
// middlewares
import { authMiddleware } from "../middleware/authMiddleware";
// controllers
import { getUser, signin, signup } from "../controller/userController";

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/", authMiddleware, getUser);

export default router;
