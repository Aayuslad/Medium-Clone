import { Router } from "express";
import {
    followUser,
    getUser,
    getUserProfile,
    signInUser,
    signOutUser,
    signUpUser,
    updateUser,
    updateUserAboutSection,
} from "../controller/userController";
import authMiddleware from "../middleware/authMiddleware";
const router = Router();
import { upload } from "../middleware/multerMiddleware";

router.post("/signup", signUpUser);
router.post("/signin", signInUser);
router.post("/signOut", signOutUser);
router.get("/", authMiddleware, getUser);
router.get("/userProfile/:id", getUserProfile);
router.put("/", authMiddleware, upload.single("profileImg"), updateUser);
router.put("/aboutSection", authMiddleware, updateUserAboutSection);
router.post("/followUser", authMiddleware, followUser);

export default router;
