import { Router } from "express";
import {
	clapStory,
	createStory,
	deleteStory,
	followTopic,
	getAllStories,
	getReadingHistory,
	getResponseByStoryId,
	getSavedStories,
	getStoriesByAuthor,
	getStoriesByTopics,
	getStory,
	getTopic,
	makeResponse,
	saveStory,
	upadateStory,
} from "../controller/storyController";
import authMiddleware from "../middleware/authMiddleware";
const router = Router();
import { upload } from "../middleware/multerMiddleware";

router.post("/", authMiddleware, upload.single("coverImg"), createStory);
router.put("/", authMiddleware, upload.single("coverImg"), upadateStory);
router.get("/savedStories", authMiddleware, getSavedStories);
router.get("/bulk", getAllStories);
router.get("/getStoriesByTopics/:topics", getStoriesByTopics);
router.get("/getStoriesByAuthor", authMiddleware, getStoriesByAuthor);
router.get("/readingHistory", authMiddleware, getReadingHistory);
router.get("/topic/:topic", getTopic);
router.get("/responses/:storyId", authMiddleware, getResponseByStoryId);
router.get("/:id", getStory);
router.post("/clap", authMiddleware, clapStory);
router.post("/save", authMiddleware, saveStory);
router.post("/followTopic", authMiddleware, followTopic);
router.post("/makeResponse", authMiddleware, makeResponse);
router.delete("/:id", authMiddleware, deleteStory);

export default router;
