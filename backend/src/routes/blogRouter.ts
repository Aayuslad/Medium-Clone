import { Hono } from "hono";
const router = new Hono();
// middlewares
import { authMiddleware } from "../middleware/authMiddleware";
// controllers
import { clapBlog, createBlog, deleteBlog, getAllBlogs, getBlog, updateBlog } from "../controller/blogController";

router.get("/bulk", getAllBlogs);
router.get("/:id", getBlog);
router.post("/", authMiddleware, createBlog);
router.post("/clap", authMiddleware, clapBlog);
router.put("/", authMiddleware, updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);

export default router;
