"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const storyController_1 = require("../controller/storyController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = (0, express_1.Router)();
const multerMiddleware_1 = require("../middleware/multerMiddleware");
router.post("/", authMiddleware_1.default, multerMiddleware_1.upload.single("coverImg"), storyController_1.createStory);
router.put("/", authMiddleware_1.default, multerMiddleware_1.upload.single("coverImg"), storyController_1.upadateStory);
router.get("/bulk", storyController_1.getAllStories);
router.get("/:id", storyController_1.getStory);
router.post("/clap", authMiddleware_1.default, storyController_1.clapStory);
router.post("/save", authMiddleware_1.default, storyController_1.saveStory);
router.delete("/:id", authMiddleware_1.default, storyController_1.deleteStory);
exports.default = router;
