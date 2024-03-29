import { Hono } from "hono";
// controllers
import { signup, signin } from "../controller/userController";

const router = new Hono();

router.post("signup", signup);
router.post("signin", signin);

export default router;
