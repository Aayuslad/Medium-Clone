import { Hono } from "hono";
const router = new Hono();
// middlewares
import { authMiddleware } from "../middleware/authMiddleware";
// controllers
import { getUser, signOut, signin, signup, getOtherUserProfile, updateUser, updateUserAbout } from "../controller/userController";

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signOut", signOut);
router.get("/", authMiddleware, getUser);
router.put("/", authMiddleware, updateUser);
router.put("/aboutSection", authMiddleware, updateUserAbout);
router.get("/userProfile/:id", getOtherUserProfile);

export default router;
