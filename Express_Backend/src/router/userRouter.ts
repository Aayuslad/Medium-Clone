import { Router } from "express";
import {
	followUser,
	getRandomAuthors,
	getRandomTopics,
	getUser,
	getUserFollowingAuthors,
	getUserMutedAuthors,
	getUserProfile,
	getUserRecomendations,
	getUserStories,
	globalSearch,
	muteAuthor,
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
router.get("/userStories/:id", getUserStories);
router.put("/", authMiddleware, upload.single("profileImg"), updateUser);
router.put("/aboutSection", authMiddleware, updateUserAboutSection);
router.get("/getUserFollowingAuthors", authMiddleware, getUserFollowingAuthors);
router.get("/getUserMutedAuthors", authMiddleware, getUserMutedAuthors);
router.get("/getRandomAuthors", getRandomAuthors);
router.get("/getRandomTopics", getRandomTopics);
router.get("/search", globalSearch);
router.get("/getUserRecomendations", getUserRecomendations);
router.post("/followUser", authMiddleware, followUser);
router.post("/muteAuthor/:authorId", authMiddleware, muteAuthor);

export default router;
