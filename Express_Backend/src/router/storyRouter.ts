import { Router } from "express";
import { clapStory, createStory, deleteStory, getAllStories, getReadingHistory, getSavedStories, getStory, saveStory, upadateStory } from "../controller/storyController";
import authMiddleware from "../middleware/authMiddleware";
const router = Router();
import { upload } from "../middleware/multerMiddleware";

router.post("/", authMiddleware, upload.single("coverImg"), createStory);
router.put("/", authMiddleware, upload.single("coverImg"), upadateStory);
router.get("/savedStories", authMiddleware, getSavedStories);
router.get("/bulk", getAllStories);
router.get("/readingHistory", authMiddleware, getReadingHistory);
router.get("/:id", getStory);
router.post("/clap", authMiddleware, clapStory);
router.post("/save", authMiddleware, saveStory);
router.delete("/:id", authMiddleware, deleteStory);

export default router;
