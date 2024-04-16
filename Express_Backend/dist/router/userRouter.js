"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = (0, express_1.Router)();
const multerMiddleware_1 = require("../middleware/multerMiddleware");
router.post("/signup", userController_1.signUpUser);
router.post("/signin", userController_1.signInUser);
router.post("/signOut", userController_1.signOutUser);
router.get("/", authMiddleware_1.default, userController_1.getUser);
router.put("/", authMiddleware_1.default, multerMiddleware_1.upload.single("profileImg"), userController_1.updateUser);
router.put("/aboutSection", authMiddleware_1.default, userController_1.updateUserAboutSection);
router.get("/userProfile/:id", userController_1.getUserProfile);
router.post("/followUser", authMiddleware_1.default, userController_1.followUser);
exports.default = router;