import { Router } from "express";
import { clapStory, createStory, deleteStory, getAllStories, getStory, saveStory, upadateStory } from "../controller/storyController";
import authMiddleware from "../middleware/authMiddleware";
const router = Router();
import { upload } from "../middleware/multerMiddleware";

router.post("/", authMiddleware, upload.single("coverImg"), createStory);
router.put("/", authMiddleware, upload.single("coverImg"), upadateStory);
router.get("/bulk", getAllStories);
router.get("/:id", getStory);
router.post("/clap", authMiddleware, clapStory);
router.post("/save", authMiddleware, saveStory);
router.delete("/:id", authMiddleware, deleteStory);

export default router;
