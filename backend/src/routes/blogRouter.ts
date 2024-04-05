import { Hono } from "hono";
// middlewares
import { authMiddleware } from "../middleware/authMiddleware";
// controllers
import { createBlog, deleteBlog, getAllBlogs, getBlog, updateBlog } from "../controller/blogController";
const router = new Hono();

router.get("/bulk", getAllBlogs);
router.get("/:id", getBlog);
router.post("/", authMiddleware, createBlog);
router.put("/", authMiddleware, updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);

export default router;
