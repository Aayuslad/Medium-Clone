import { Hono } from "hono";
// controllers
import { getUser, signin, signup } from "../controller/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = new Hono();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/", authMiddleware, getUser);

export default router;
